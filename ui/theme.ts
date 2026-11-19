import { Widget } from 'scripting'

export const INK = { light: '#18231C', dark: '#FFFFFF' } as const
export const INK_MUTED = {
  light: 'rgba(24,35,28,0.7)',
  dark: 'rgba(255,255,255,0.7)'
} as const
export const TILE = {
  light: 'rgba(0,112,107,0.05)',
  dark: 'rgba(4,96,91,0.15)'
} as const
export const CLEAR = 'rgba(0,112,107,0)'

export const GRID_MARK_URL =
  'https://cdn.jsdelivr.net/gh/SmallMr/Scripting-SGCC@main/assets/logo.png'

/** 设计稿尺寸按小组件短边的百分比换算。 */
export function vmin(value: number) {
  const { width, height } = Widget.displaySize
  return (value * Math.min(width, height)) / 100
}

/** 早期稿子是按 155pt 的小号组件标注的。 */
export function legacyPt(value: number) {
  return vmin((value * 100) / 155)
}

export function clockText(timestamp: number) {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`
}
