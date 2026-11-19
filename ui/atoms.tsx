import {
  Capsule,
  HStack,
  Image,
  Rectangle,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  ZStack
} from 'scripting'
import {
  TIER_BACKGROUNDS,
  TIER_BAR_FILLS,
  TIER_COLORS,
  tierSegmentProgress
} from '../core/usage'
import type { Tier, UsageBar } from '../core/usage'
import { GRID_MARK_URL, INK, INK_MUTED, TILE, legacyPt } from './theme'

export function GridMark({ size }: { size: number }) {
  return (
    <Image
      imageUrl={GRID_MARK_URL}
      resizable
      scaleToFit
      frame={{ width: size, height: size }}
      widgetAccentedRenderingMode="fullColor"
    />
  )
}

export function UsageColumns({
  items,
  height,
  columnWidth,
  gap,
  inset
}: {
  items: UsageBar[]
  height: number
  columnWidth: number
  /**
   * 不叫 `padding`：那是通用视图属性，运行时会把它也作用到组件本身，
   * 导致内边距被叠加两次。
   */
  inset?: { vertical: number; horizontal: number }
  /** 固定间距；不传时柱子均分整行。 */
  gap?: number
}) {
  const peak = Math.max(0, ...items.map(({ value }) => value)) || 1
  return (
    <HStack
      alignment="bottom"
      spacing={gap ?? 0}
      frame={{ height }}
      padding={inset}
    >
      {items.flatMap(({ value, tier }, index) => [
        ...(index > 0 && gap == null
          ? [<Spacer key={`gap-${index}`} minLength={0} />]
          : []),
        <Capsule
          key={`column-${index}`}
          fill={{
            colors: TIER_BAR_FILLS[tier],
            startPoint: 'top',
            endPoint: 'bottom'
          }}
          frame={{
            width: columnWidth,
            height: Math.max(columnWidth, (value / peak) * height)
          }}
        />
      ])}
    </HStack>
  )
}

/**
 * 小号组件卡片底部那条三档进度：每档按年度进度填充，卡片圆角会把两端裁掉。
 */
export function TierRibbon({
  tier,
  percent,
  width
}: {
  tier: Tier
  percent: number
  width: number
}) {
  const fills = tierSegmentProgress(tier, percent)
  const height = legacyPt(4)
  const gap = width * 0.02
  const segment = (width - gap * 2) / 3
  return (
    <HStack spacing={gap} frame={{ width, height }}>
      {([1, 2, 3] as Tier[]).map((item, index) => (
        <ZStack
          key={item}
          alignment="leading"
          frame={{ width: segment, height }}
        >
          <Rectangle fill={TIER_BACKGROUNDS[item]} />
          {fills[index] > 0 ? (
            <Rectangle
              fill={TIER_COLORS[item]}
              frame={{ width: segment * fills[index], height }}
            />
          ) : null}
        </ZStack>
      ))}
    </HStack>
  )
}

/** 中号组件用的刻度式阶梯条。 */
export function TierTicks({
  tier,
  percent,
  width
}: {
  tier: Tier
  percent: number
  width: number
}) {
  const gap = legacyPt(2)
  const tickWidth = 2
  const perTier = Math.max(
    1,
    Math.floor(Math.floor((width + gap) / (tickWidth + gap)) / 3)
  )
  const lastFilled = Math.floor(perTier * tier * percent)
  const colors = Array.from({ length: perTier * 3 }, (_, index) => {
    const level = (Math.floor(index / perTier) + 1) as Tier
    return index > lastFilled ? TIER_BACKGROUNDS[level] : TIER_COLORS[level]
  })
  return (
    <HStack spacing={gap} frame={{ maxHeight: 'infinity' }}>
      {colors.map((color, index) => (
        <RoundedRectangle
          key={index}
          cornerRadius={1}
          fill={color}
          frame={{ width: tickWidth, maxHeight: 'infinity' }}
        />
      ))}
    </HStack>
  )
}

export function StatTile({
  label,
  value
}: {
  label: string
  value: string | number
}) {
  return (
    <VStack
      alignment="leading"
      spacing={1}
      frame={{ maxWidth: 'infinity', alignment: 'leading' }}
      padding={{ vertical: legacyPt(6), horizontal: legacyPt(12) }}
      background={<RoundedRectangle cornerRadius={legacyPt(6)} fill={TILE} />}
    >
      <Text font={legacyPt(8)} foregroundStyle={INK_MUTED}>
        {label}
      </Text>
      <Text
        font={14}
        fontWeight="bold"
        fontDesign="rounded"
        foregroundStyle={INK}
        lineLimit={1}
        minScaleFactor={0.5}
      >
        {value}
      </Text>
    </VStack>
  )
}
