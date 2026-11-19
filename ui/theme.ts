import { Widget } from 'scripting'

type Palette = { light: string; dark: string }

const palette = (light: string, dark: string): Palette => ({ light, dark })

export const WIDGET_BG = palette('#FFFFFF', '#141917')
export const INK = palette('#17211C', '#F7FAF8')
export const MUTED = palette('#61716A', '#BECBC5')
export const QUIET = palette('#7B8A83', '#9EAEA7')
export const FAINT = palette('#A0ACA6', '#6F7E77')
export const LINE = palette('#E4ECE8', '#2C3A34')
export const MONEY = palette('#55645E', '#C7D1CC')
export const UNIT = palette('#788881', '#AAB8B2')

export const RED = '#C96A60'
export const RED_TEXT = '#AC4C43'
export const BLUE = '#6D97BE'
export const BLUE_TEXT = '#47739C'
export const AMBER = '#DDAA56'
export const AMBER_TEXT_ON_LIGHT = '#91641E'
export const TIER_GREEN = '#159B7E'
export const TIER_AMBER = '#E0A84C'
export const TIER_THIRD = '#C89674'

export const MAX_BG = palette('#FBEAE7', '#3C2724')
export const MIN_BG = palette('#EAF2FA', '#20303E')
export const TODAY_BG = palette('#FBF0DC', '#3A2E1D')

/** 日历普通日期由浅到深的四档底色，让用电高低一眼可见。 */
export const HEAT_BG = [
  'rgba(23,74,64,0.035)',
  'rgba(23,74,64,0.070)',
  'rgba(23,74,64,0.105)',
  'rgba(23,74,64,0.145)'
] as const

export const FUTURE_BG = 'rgba(23,74,64,0.018)'
export const BLANK_BG = 'rgba(23,74,64,0.010)'

export const GRID_MARK_URL =
  'https://cdn.jsdelivr.net/gh/SmallMr/Scripting-SGCC@main/assets/logo.png'

/**
 * 设计稿按 2 倍像素标注；这里统一换算成当前组件上的点。
 * 组件比例固定，所以只按宽度缩放，窗口尺寸不会改变版式。
 */
export function px(value: number) {
  const width = Widget.displaySize.width || 338
  const nominal = Widget.family === 'systemSmall' ? 158 : 338
  return (value / 2) * (width / nominal)
}

/** 去掉无意义的尾零，同时保留一位小数和千位分隔。 */
export function formatUsage(value: number) {
  const safe = Number.isFinite(value) ? value : 0
  const rounded = Math.round(safe * 10) / 10
  const [integer, decimal] = rounded.toFixed(1).split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal === '0' ? grouped : `${grouped}.${decimal}`
}

export function formatMoney(value: number | string) {
  const safe = Number(value)
  if (!Number.isFinite(safe)) return '0.00'
  const [integer, decimal] = safe.toFixed(2).split('.')
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`
}

export function clockText(timestamp: number) {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`
}

export function monthStamp(timestamp: number) {
  const month = new Date(timestamp).getMonth() + 1
  return `${month}月`
}

export function updatedAtText(timestamp: number) {
  return `更新 ${clockText(timestamp)}`
}
