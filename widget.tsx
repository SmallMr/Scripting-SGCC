import { Widget } from 'scripting'
import { loadUsageFeed, toErrorMessage } from './core/gateway'
import { readWidgetSettings } from './core/settings'
import type { CompactStyle } from './core/settings'
import { buildUsageSummary } from './core/usage'
import { FailureView, WidgetCanvas } from './ui/canvas'

/**
 * 桌面 / 锁屏小组件入口。
 *
 * 无论取数成功还是失败，最后都会走到 `Widget.present`：请求有超时上限，
 * 失败时渲染错误页。
 *
 * `Widget.parameter` 可覆盖设置里的户号和小号模式：
 * - `0` / `1`：第一户、第二户
 * - `bill` / `month` / `tier`：小号内容
 * - `0;bill`：同时指定户号和小号内容
 */

/** 登录加上每个户号约 5 次请求，两端都跑纯 JS 的 SM2，留 20 秒。 */
const REQUEST_TIMEOUT_MS = 20000
const WIDGET_RELOAD_MINUTES = 60

const SMALL_MODES: CompactStyle[] = ['month', 'bill', 'tier']

function readWidgetParameter() {
  const parts = (Widget.parameter || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
  let accountIndex: number | undefined
  let smallWidgetMode: CompactStyle | undefined
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      accountIndex = Number(part)
    } else if (SMALL_MODES.includes(part as CompactStyle)) {
      smallWidgetMode = part as CompactStyle
    }
  }
  return { accountIndex, smallWidgetMode }
}

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('请求国网超时，请稍后再试')), ms)
    )
  ])
}

async function renderWidget() {
  const reloadPolicy = {
    policy: 'after',
    date: new Date(Date.now() + WIDGET_RELOAD_MINUTES * 60 * 1000)
  } as const

  try {
    const saved = readWidgetSettings()
    const override = readWidgetParameter()
    const settings = {
      ...saved,
      accountIndex: override.accountIndex ?? saved.accountIndex,
      smallWidgetMode: override.smallWidgetMode ?? saved.smallWidgetMode
    }
    const accountIndex = settings.accountIndex
    const feed = await withTimeout(loadUsageFeed(), REQUEST_TIMEOUT_MS)
    const payload = Number.isInteger(accountIndex)
      ? feed.list[accountIndex]
      : null
    if (!payload) throw new Error(`户号 ${accountIndex} 不存在或查询失败`)
    Widget.present(
      <WidgetCanvas
        summary={buildUsageSummary(payload)}
        settings={settings}
        syncedAt={feed.fetchedAt}
        warning={feed.error}
      />,
      { reloadPolicy }
    )
  } catch (error) {
    console.error(error)
    Widget.present(<FailureView message={toErrorMessage(error)} />, {
      reloadPolicy
    })
  }
}

renderWidget()
