import { AbortController, fetch } from 'scripting'
import { K, SgApp, queryAccount } from '../vendor/sgcc_protocol'
import {
  KEYCHAIN_PREFIX,
  getPassword,
  loadCache,
  loadPreference,
  saveCache
} from '../store'
import type { Cache } from '../store'
import type { RawAccount } from '../data'

/** 一次国网请求的缓存有效期，由设置里的“更新时间”决定。 */
export const FALLBACK_FETCH_HOURS = 4

export function minFetchIntervalMs(): number {
  const { refreshHours } = loadPreference()
  const hours =
    Number.isFinite(refreshHours) && refreshHours > 0
      ? refreshHours
      : FALLBACK_FETCH_HOURS
  return hours * 60 * 60 * 1000
}

const MAX_ACCOUNTS = 6

/**
 * Storage and network adapters `SgApp` runs on.
 * @param smsCode new-device SMS code, consumed once by `SgApp.ensure`
 */
function createCtx(smsCode = '') {
  return {
    env: { SGCC_SMS: smsCode },
    storage: {
      getJSON: (k: string) => {
        const key = KEYCHAIN_PREFIX + k
        return Keychain.contains(key) ? JSON.parse(Keychain.get(key) ?? 'null') : null
      },
      setJSON: (k: string, v: unknown) =>
        Keychain.set(KEYCHAIN_PREFIX + k, JSON.stringify(v))
    },
    http: {
      post: async (
        url: string,
        {
          headers = {},
          body = '',
          timeout = 20000
        }: { headers?: Record<string, unknown>; body?: string; timeout?: number }
      ) => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeout)
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: Object.fromEntries(
              Object.entries(headers).map(([k, v]) => [k, v == null ? '' : String(v)])
            ),
            body,
            signal: controller.signal,
            timeout: timeout / 1000
          })
          const text = await response.text()
          return { status: response.status, text: async () => text }
        } finally {
          clearTimeout(timer)
        }
      }
    }
  }
}

function createApp() {
  const { phone, smsCode } = loadPreference()
  const password = getPassword()
  if (!phone || !password) {
    throw new Error('请先在设置中填写网上国网手机号和密码')
  }
  return new SgApp(createCtx(String(smsCode || '').trim()), phone, password)
}

async function fetchAccounts(): Promise<(RawAccount | null)[]> {
  const app = createApp()
  const { accounts = [] } = await app.ensure()
  if (!accounts.length) throw new Error('该网上国网账号未绑定户号')

  const list: (RawAccount | null)[] = []
  let error: unknown
  for (const account of accounts.slice(0, MAX_ACCOUNTS)) {
    try {
      list.push(await queryAccount(app, account))
    } catch (e) {
      console.error(e)
      error = e
      // 占位保证小组件参数下标与户号顺序一致
      list.push(null)
    }
  }
  if (list.every((item) => !item)) throw error
  return list
}

export type DataResult = Cache & {
  /** Set when a refresh failed and the cache was served instead. */
  error?: string
}

export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}

/**
 * Cached data before the configured interval, otherwise a fresh fetch. A
 * failed fetch falls back to the cache; only with no cache at all does it throw.
 */
export async function getData({ force = false } = {}): Promise<DataResult> {
  const cache = loadCache()
  if (!force && cache && Date.now() - cache.fetchedAt < minFetchIntervalMs()) {
    return cache
  }
  try {
    const next: Cache = { fetchedAt: Date.now(), list: await fetchAccounts() }
    saveCache(next)
    return next
  } catch (e) {
    console.error(e)
    if (!cache) throw e
    return { ...cache, error: errorMessage(e) }
  }
}

/** Sends the new-device SMS code; resolves to the masked phone number. */
export async function sendSms(): Promise<string> {
  // `user` is set in the vendored constructor, which TS cannot see through @ts-nocheck.
  const app = createApp() as SgApp & { user: string }
  const codeKey = await app.sendDeviceSms()
  app.st(app.sk(K.sms), { user: app.user, codeKey, ts: Date.now(), used: '' })
  return `${app.user.slice(0, 3)}****${app.user.slice(-4)}`
}
