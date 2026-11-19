import type { Color } from 'scripting'
import type { TrendUnit } from './settings'

/** 网上国网接口返回的户号数据（只列出用到的字段）。 */
export type GridAccountPayload = {
  userInfo?: {
    consNo?: string
    consNo_dst?: string
    consName_dst?: string
    orgName?: string
    proNo?: string
  }
  arrearsOfFees?: boolean
  /** 后付费户才有 `accountBalance`（账户预存款）。 */
  eleBill?: { sumMoney?: number | string; accountBalance?: number | string }
  dayElecQuantity31?: {
    sevenEleList?: { day: string; dayElePq: number | string }[]
  }
  monthElecQuantity?: {
    mothEleList?: {
      month: string
      monthEleNum: number | string
      monthEleCost: number | string
    }[]
    dataInfo?: { totalEleNum?: number | string; totalEleCost?: number | string }
  }
}

export type DayUsage = { day: string; value: number }
export type MonthUsage = { month: string; pq: number; cost: number }

/** 小组件真正会用到的汇总数据。 */
export type UsageSummary = {
  hasArrears: boolean
  balance: string
  previousCost: string
  previousUsage: number
  yearUsage: number
  yearCost: string
  /** 计入年度阶梯的电量。 */
  tierUsage: number
  days: DayUsage[]
  months: MonthUsage[]
}

export type Tier = 1 | 2 | 3
export type UsageBar = { value: number; tier: Tier }

/** 每档柱子的上下渐变色。 */
export const TIER_BAR_FILLS: Record<Tier, [Color, Color]> = {
  1: ['#81CDC7', '#00706B'],
  2: ['#FFEE8C', '#E8C70B'],
  3: ['#FCBF94', '#D0580D']
}

export const TIER_COLORS: Record<Tier, Color> = {
  1: '#00706B',
  2: '#E8C70B',
  3: '#D0580D'
}

/** 阶梯条的底槽：同色 10% 透明度。 */
export const TIER_BACKGROUNDS: Record<Tier, Color> = {
  1: 'rgba(0,112,107,0.1)',
  2: 'rgba(232,199,11,0.1)',
  3: 'rgba(208,88,13,0.1)'
}

const asNumber = (value: unknown) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const currentMonthKey = () => {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthOfDay(day: string) {
  return day.slice(0, 6)
}

/** 把接口原始数据整理成组件直接可用的结构。 */
export function buildUsageSummary(payload: GridAccountPayload): UsageSummary {
  const { eleBill = {}, dayElecQuantity31 = {}, monthElecQuantity = {} } = payload

  const days = (dayElecQuantity31.sevenEleList || [])
    .filter(
      ({ dayElePq }) =>
        dayElePq !== '' &&
        dayElePq != null &&
        !Number.isNaN(Number(dayElePq))
    )
    .map(({ day, dayElePq }) => ({ day: String(day), value: Number(dayElePq) }))
    .sort((a, b) => a.day.localeCompare(b.day))

  const months = (monthElecQuantity.mothEleList || [])
    .map(({ month, monthEleNum, monthEleCost }) => ({
      month: String(month),
      pq: asNumber(monthEleNum),
      cost: asNumber(monthEleCost)
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  const monthKey = currentMonthKey()
  // 最近一个已经结算的月份作为“上期”
  const settled = months.filter(
    ({ month, pq, cost }) => month < monthKey && (pq > 0 || cost > 0)
  )
  const lastSettled = settled[settled.length - 1]
  const yearUsage = asNumber(monthElecQuantity.dataInfo?.totalEleNum)
  // 阶梯电量 = 年度已结算电量 + 本月尚未结算的日用电
  const pendingUsage = months.some(({ month }) => month === monthKey)
    ? 0
    : days
        .filter(({ day }) => day.startsWith(monthKey))
        .reduce((sum, { value }) => sum + value, 0)

  const hasArrears = !!payload.arrearsOfFees
  // 后付费用户的 sumMoney 是应缴账单，余额要取 accountBalance
  const isPostPaid = Object.prototype.hasOwnProperty.call(
    eleBill,
    'accountBalance'
  )
  const balance =
    isPostPaid && !hasArrears ? eleBill.accountBalance : eleBill.sumMoney

  return {
    hasArrears,
    balance: asNumber(balance).toFixed(2),
    previousCost: lastSettled ? lastSettled.cost.toFixed(2) : '0.00',
    previousUsage: lastSettled ? lastSettled.pq : 0,
    yearUsage,
    yearCost: asNumber(monthElecQuantity.dataInfo?.totalEleCost).toFixed(2),
    tierUsage: Math.round(yearUsage + pendingUsage),
    days,
    months
  }
}

export function resolveTier(
  total: number,
  firstCap: number,
  secondCap: number
): Tier {
  return total > secondCap ? 3 : total > firstCap ? 2 : 1
}

/** 取最近 `count` 根柱子，并按当期累计电量给每根柱子着色。 */
export function pickRecentBars(
  summary: UsageSummary,
  options: {
    unit: TrendUnit
    count: number
    firstCap: number
    secondCap: number
  }
): UsageBar[] {
  const { unit, count, firstCap, secondCap } = options
  const tiersByMonth: Record<string, Tier> = {}
  const bars: UsageBar[] = []
  let year = ''
  let yearTotal = 0

  for (const { month, pq } of summary.months) {
    if (month.slice(0, 4) !== year) {
      year = month.slice(0, 4)
      yearTotal = 0
    }
    yearTotal += pq
    const tier = resolveTier(yearTotal, firstCap, secondCap)
    tiersByMonth[month] = tier
    if (unit === 'monthly') bars.push({ value: pq, tier })
  }

  if (unit === 'daily') {
    const thisYear = String(new Date().getFullYear())
    const monthsThisYear = Object.keys(tiersByMonth).filter((month) =>
      month.startsWith(thisYear)
    )
    // 本月还没结算时，沿用今年最近一个月的阶梯
    const latestTier =
      tiersByMonth[monthsThisYear[monthsThisYear.length - 1]] || 1
    for (const { day, value } of summary.days) {
      const month = monthOfDay(day)
      const tier = month.startsWith(thisYear)
        ? tiersByMonth[month] || latestTier
        : 1
      bars.push({ value, tier })
    }
  }

  return bars.slice(-Math.max(1, count))
}

/**
 * 当前阶梯以及在该阶梯里的进度。第三阶梯没有上限，按和第二阶梯相同的
 * 宽度（`2 * secondCap - firstCap`）来归一化。
 */
export function tierPosition(
  usage: number,
  firstCap: number,
  secondCap: number
): { tier: Tier; percent: number } {
  const tier = resolveTier(usage, firstCap, secondCap)
  const cap = [firstCap, secondCap, secondCap * 2 - firstCap][tier - 1]
  const percent = cap > 0 ? Math.min(usage / cap, 1) : 0
  return { tier, percent }
}

/** 三档分别填充了多少，和 `tierPosition` 使用同一把尺子。 */
export function tierSegmentProgress(
  tier: Tier,
  percent: number
): [number, number, number] {
  const filled = tier * percent
  const fill = (index: number) => Math.max(0, Math.min(1, filled - index))
  return [fill(0), fill(1), fill(2)]
}

export const TIER_CAPTIONS: Record<Tier, string> = { 1: '一', 2: '二', 3: '三' }
