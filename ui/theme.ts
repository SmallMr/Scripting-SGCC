import { Widget } from 'scripting'

type Palette = { light: string; dark: string }

const palette = (light: string, dark: string): Palette => ({ light, dark })

export const WIDGET_BG = palette('#FFFFFF', '#141917')
export const INK = palette('#17251F', '#F7FAF8')
export const MUTED = palette('#5F716A', '#C0CCC7')
export const QUIET = palette('#6F817A', '#A8B7B1')
export const FAINT = palette('#94A39D', '#67766F')
export const LINE = palette('#DCE7E3', '#31403A')
export const TILE = palette('#EEF4F2', '#1F2C27')
export const TILE_SOFT = palette('#F6F9F8', '#1A2420')
export const MONEY = palette('#4C5D56', '#C4CEC9')
export const UNIT = palette('#687A73', '#A9B7B2')
export const AMBER_TEXT = palette('#765316', '#E3C78D')

export const RED = '#DC766B'
export const BLUE = '#6C9DC6'
export const AMBER = '#E9AE4B'
export const TIER_GREEN = '#18A080'
export const TIER_AMBER = '#E8B04E'
export const TIER_REST = '#CFDBD6'

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
  return `${month}月 · 更新 ${clockText(timestamp)}`
}
