import { Widget } from 'scripting'

type Palette = { light: string; dark: string }

const palette = (light: string, dark: string): Palette => ({ light, dark })

export const WIDGET_BG = palette('#FFFFFF', '#141917')
export const INK = palette('#20342F', '#F4F8F6')
export const MUTED = palette('#7D8E88', '#A5B3AE')
export const QUIET = palette('#94A29D', '#8E9D98')
export const FAINT = palette('#B9C5C1', '#65736E')
export const LINE = palette('#E7EEEB', '#2A3632')
export const TILE = palette('#F3F7F6', '#1D2824')
export const TILE_SOFT = palette('#F7FAF9', '#19231F')
export const MONEY = palette('#596761', '#B8C4BF')
export const UNIT = palette('#8A9993', '#95A49E')
export const AMBER_TEXT = palette('#8B6928', '#E0C184')

export const RED = '#DC766B'
export const BLUE = '#6C9DC6'
export const AMBER = '#E9AE4B'
export const TIER_GREEN = '#18A080'
export const TIER_AMBER = '#E8B04E'
export const TIER_REST = '#DCE5E1'

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
