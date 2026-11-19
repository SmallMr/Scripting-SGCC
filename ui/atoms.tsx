import {
  Capsule,
  Circle,
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
  AMBER_TEXT_ON_LIGHT,
  BLANK_BG,
  BLUE_TEXT,
  FAINT,
  FUTURE_BG,
  GRID_MARK_URL,
  HEAT_BG,
  HERO_BOTTOM,
  HERO_FAINT,
  HERO_INK,
  HERO_MUTED,
  HERO_TOP,
  INK,
  LINE,
  MAX_BG,
  MIN_BG,
  MONEY,
  MUTED,
  QUIET,
  RED_TEXT,
  TIER_AMBER,
  TIER_GREEN,
  TIER_THIRD,
  TODAY_BG,
  UNIT,
  formatMoney,
  formatUsage,
  monthStamp,
  px,
  updatedAtText
} from './theme'

const CLEAR = 'rgba(0,0,0,0)'

/** 主数据卡：深绿渐变的单一视觉焦点，避免把内容切成许多小卡片。 */
export function HeroSurface({
  width,
  height,
  inset = px(24),
  radius = px(32),
  children
}: {
  width: number
  height: number
  inset?: number
  radius?: number
  children?: any
}) {
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height }}
      background={
        <RoundedRectangle
          cornerRadius={radius}
          fill={{
            colors: [HERO_TOP, HERO_BOTTOM],
            startPoint: 'top',
            endPoint: 'bottom'
          }}
        />
      }
    >
      <HStack
        alignment="center"
        spacing={px(10)}
        frame={{ width: width - inset * 2, height }}
      >
        {children}
      </HStack>
    </VStack>
  )
}

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

/** 左上角只保留真实国网标识，右上角用月份和更新时间形成轻量页眉。 */
export function BrandHeader({
  syncedAt,
  logoSize,
  fontSize,
  gap
}: {
  syncedAt: number
  logoSize: number
  fontSize: number
  gap: number
}) {
  return (
    <VStack alignment="leading" spacing={0} frame={{ maxWidth: 'infinity' }}>
      <HStack
        alignment="center"
        spacing={0}
        frame={{ maxWidth: 'infinity', height: logoSize }}
      >
        <GridMark size={logoSize} />
        <Spacer />
        <HStack alignment="center" spacing={px(6)}>
          <Text
            font={fontSize}
            fontWeight="semibold"
            foregroundStyle={MUTED}
            lineLimit={1}
          >
            {monthStamp(syncedAt)}
          </Text>
          <Circle fill={FAINT} frame={{ width: px(3), height: px(3) }} />
          <Text
            font={fontSize * 0.9}
            fontWeight="medium"
            foregroundStyle={FAINT}
            lineLimit={1}
            minScaleFactor={0.75}
          >
            {updatedAtText(syncedAt)}
          </Text>
        </HStack>
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: gap }} />
    </VStack>
  )
}

export function UsageValue({
  value,
  fontSize,
  unitSize,
  color = INK,
  unitColor = UNIT,
  weight = 'semibold',
  align = 'leading'
}: {
  value: number | string
  fontSize: number
  unitSize: number
  color?: unknown
  unitColor?: unknown
  weight?: string
  align?: 'leading' | 'trailing' | 'center'
}) {
  return (
    <HStack alignment="lastTextBaseline" spacing={px(2)}>
      <Text
        font={fontSize}
        fontWeight={weight}
        foregroundStyle={color}
        lineLimit={1}
        minScaleFactor={0.5}
        multilineTextAlignment={align}
      >
        {value}
      </Text>
      <Text
        font={unitSize}
        fontWeight="medium"
        foregroundStyle={unitColor}
        lineLimit={1}
        minScaleFactor={0.7}
      >
        度
      </Text>
    </HStack>
  )
}

export function MoneyAmount({
  value,
  fontSize,
  color = MONEY
}: {
  value: number | string
  fontSize: number
  color?: unknown
}) {
  return (
    <HStack alignment="lastTextBaseline" spacing={px(1)}>
      <Text
        font={fontSize * 0.58}
        fontWeight="medium"
        foregroundStyle={color}
        lineLimit={1}
        minScaleFactor={0.75}
      >
        ¥
      </Text>
      <Text
        font={fontSize}
        fontWeight="medium"
        foregroundStyle={color}
        lineLimit={1}
        minScaleFactor={0.62}
      >
        {formatMoney(value)}
      </Text>
    </HStack>
  )
}

/**
 * 主卡右侧的指标行。
 * 标签在左、整组数值和金额靠右，金额不会漂到相邻指标旁边。
 */
export function HeroMetaLine({
  label,
  value,
  money,
  labelWidth,
  labelSize,
  valueSize,
  unitSize,
  moneySize
}: {
  label: string
  value: number
  money?: number | string
  labelWidth: number
  labelSize: number
  valueSize: number
  unitSize: number
  moneySize: number
}) {
  return (
    <HStack
      alignment="lastTextBaseline"
      spacing={px(6)}
      frame={{ maxWidth: 'infinity' }}
    >
      <Text
        font={labelSize}
        fontWeight="medium"
        foregroundStyle={HERO_MUTED}
        lineLimit={1}
        frame={{ width: labelWidth, alignment: 'leading' }}
      >
        {label}
      </Text>
      <Spacer minLength={0} />
      <UsageValue
        value={formatUsage(value)}
        fontSize={valueSize}
        unitSize={unitSize}
        color={HERO_INK}
        unitColor={HERO_FAINT}
      />
      {money != null ? (
        <Text
          font={px(13)}
          fontWeight="medium"
          foregroundStyle={HERO_FAINT}
          lineLimit={1}
        >
          ·
        </Text>
      ) : null}
      {money != null ? (
        <MoneyAmount value={money} fontSize={moneySize} color={HERO_MUTED} />
      ) : null}
    </HStack>
  )
}

/** 白底指标行，数值和金额作为一个整体靠右。 */
export function MetaLine({
  label,
  value,
  money,
  labelWidth,
  labelSize,
  valueSize,
  unitSize,
  moneySize,
  fill = false
}: {
  label: string
  value: number
  money?: number | string
  labelWidth: number
  labelSize: number
  valueSize: number
  unitSize: number
  moneySize: number
  fill?: boolean
}) {
  return (
    <HStack
      alignment="lastTextBaseline"
      spacing={px(5)}
      frame={fill ? { maxWidth: 'infinity' } : undefined}
    >
      <Text
        font={labelSize}
        fontWeight="medium"
        foregroundStyle={MUTED}
        lineLimit={1}
        frame={{ width: labelWidth, alignment: 'leading' }}
      >
        {label}
      </Text>
      {fill ? <Spacer minLength={0} /> : null}
      <UsageValue
        value={formatUsage(value)}
        fontSize={valueSize}
        unitSize={unitSize}
      />
      {money != null ? (
        <Text
          font={px(13)}
          fontWeight="medium"
          foregroundStyle={FAINT}
          lineLimit={1}
        >
          ·
        </Text>
      ) : null}
      {money != null ? <MoneyAmount value={money} fontSize={moneySize} /> : null}
    </HStack>
  )
}

/** 小号列表模式的一行；分隔线放在行内，保证四边视觉边距不漂移。 */
export function DataRow({
  label,
  value,
  money,
  width,
  height,
  first,
  labelSize,
  valueSize,
  unitSize,
  moneySize,
  labelWidth
}: {
  label: string
  value: number
  money?: number | string
  width: number
  height: number
  first?: boolean
  labelSize: number
  valueSize: number
  unitSize: number
  moneySize: number
  labelWidth: number
}) {
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
    >
      {!first ? (
        <Rectangle fill={LINE} frame={{ width, height: px(1) }} />
      ) : null}
      <HStack
        alignment="lastTextBaseline"
        spacing={px(5)}
        frame={{
          width,
          height: height - (first ? 0 : px(1)),
          alignment: 'leading'
        }}
      >
        <Text
          font={labelSize}
          fontWeight="medium"
          foregroundStyle={MUTED}
          lineLimit={1}
          frame={{ width: labelWidth, alignment: 'leading' }}
        >
          {label}
        </Text>
        <Spacer minLength={0} />
        <UsageValue
          value={formatUsage(value)}
          fontSize={valueSize}
          unitSize={unitSize}
        />
        {money != null ? (
          <Text
            font={px(12)}
            fontWeight="medium"
            foregroundStyle={FAINT}
            lineLimit={1}
          >
            ·
          </Text>
        ) : null}
        {money != null ? <MoneyAmount value={money} fontSize={moneySize} /> : null}
      </HStack>
    </VStack>
  )
}

/**
 * 三段阶梯进度：不写档位汉字，只用绿 / 琥珀 / 陶土三色和正圆滑块表达。
 * 滑块位置使用全年累计比例，第三档以后固定落在末端。
 */
export function TierPanel({
  detail,
  fraction,
  width,
  accent,
  height = px(54)
}: {
  detail: string
  fraction: number
  width: number
  accent: string
  height?: number
}) {
  const gap = px(4)
  const segmentWidth = (width - gap * 2) / 3
  const knobSize = px(17)
  const trackHeight = px(18)
  const barHeight = px(9)
  const safeFraction = Math.max(0, Math.min(1, fraction))
  const knobCenter = Math.min(
    width - knobSize / 2,
    Math.max(knobSize / 2, width * safeFraction)
  )
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
    >
      <Rectangle fill={LINE} frame={{ width, height: px(1) }} />
      <VStack
        alignment="leading"
        spacing={0}
        frame={{ width, height: height - px(1) }}
      >
        <Rectangle fill={CLEAR} frame={{ width: 1, height: px(4) }} />
        <HStack
          spacing={px(5)}
          frame={{ maxWidth: 'infinity', height: px(20) }}
        >
          <Text
            font={px(16)}
            fontWeight="medium"
            foregroundStyle={MUTED}
            lineLimit={1}
          >
            阶梯
          </Text>
          <Spacer minLength={0} />
          <Circle fill={accent} frame={{ width: px(5), height: px(5) }} />
          <Text
            font={px(16)}
            fontWeight="semibold"
            foregroundStyle={INK}
            lineLimit={1}
            minScaleFactor={0.58}
            multilineTextAlignment="trailing"
          >
            {detail}
          </Text>
        </HStack>
        <Spacer minLength={0} />
        <ZStack alignment="leading" frame={{ width, height: trackHeight }}>
          <HStack spacing={gap} frame={{ width, height: barHeight }}>
            <Capsule
              fill={TIER_GREEN}
              frame={{ width: segmentWidth, height: barHeight }}
            />
            <Capsule
              fill={TIER_AMBER}
              frame={{ width: segmentWidth, height: barHeight }}
            />
            <Capsule
              fill={TIER_THIRD}
              frame={{ width: segmentWidth, height: barHeight }}
            />
          </HStack>
          <Circle
            fill="#FFFFFF"
            frame={{ width: knobSize, height: knobSize }}
            border={{ color: accent, width: px(4.5) }}
            offset={{ x: knobCenter - knobSize / 2, y: 0 }}
          />
        </ZStack>
        <Rectangle fill={CLEAR} frame={{ width: 1, height: px(4) }} />
      </VStack>
    </VStack>
  )
}

export function SectionTitle({
  title,
  trailing,
  titleSize = px(19),
  trailingSize = px(15),
  accent = TIER_GREEN,
  height = px(24)
}: {
  title: string
  trailing: string
  titleSize?: number
  trailingSize?: number
  accent?: string
  height?: number
}) {
  return (
    <HStack
      spacing={px(7)}
      frame={{ maxWidth: 'infinity', height }}
    >
      <RoundedRectangle
        cornerRadius={px(2)}
        fill={accent}
        frame={{ width: px(4), height: px(18) }}
      />
      <Text font={titleSize} fontWeight="bold" foregroundStyle={INK} lineLimit={1}>
        {title}
      </Text>
      <Spacer minLength={0} />
      <Text
        font={trailingSize}
        fontWeight="medium"
        foregroundStyle={QUIET}
        lineLimit={1}
        minScaleFactor={0.7}
      >
        {trailing}
      </Text>
    </HStack>
  )
}

/** 14 天柱状趋势：日期、柱体、数值分三层，数值不会被柱体遮挡。 */
export function DailyBars({
  items,
  width,
  height = px(70)
}: {
  items: { day: number; value: number; isToday: boolean }[]
  width: number
  height: number
}) {
  const gap = px(2)
  const columnWidth = (width - gap * 13) / 14
  const dateHeight = px(13)
  const valueHeight = px(16)
  const barArea = height - dateHeight - valueHeight - px(1)
  const peak = Math.max(1, ...items.map(({ value }) => value))
  return (
    <HStack spacing={gap} frame={{ width, height }}>
      {items.map(({ value, day, isToday }, index) => (
        <VStack
          key={`${index}-${day}`}
          spacing={0}
          frame={{ width: columnWidth, height, alignment: 'center' }}
        >
          <Text
            font={px(12)}
            fontWeight="medium"
            foregroundStyle={isToday ? AMBER_TEXT_ON_LIGHT : QUIET}
            lineLimit={1}
          >
            {day}
          </Text>
          <ZStack
            alignment="bottom"
            frame={{ width: columnWidth, height: barArea }}
          >
            <Rectangle
              fill={LINE}
              frame={{ width: columnWidth - px(4), height: px(1) }}
            />
            <Capsule
              fill={
                isToday
                  ? {
                      colors: ['#F0C36E', '#D39132'],
                      startPoint: 'top',
                      endPoint: 'bottom'
                    }
                  : {
                      colors: ['#69CDB5', '#0D876E'],
                      startPoint: 'top',
                      endPoint: 'bottom'
                    }
              }
              frame={{
                width: px(9),
                height: Math.max(px(4), (value / peak) * (barArea - px(1)))
              }}
            />
          </ZStack>
          <Text
            font={px(16)}
            fontWeight="semibold"
            foregroundStyle={isToday ? AMBER_TEXT_ON_LIGHT : INK}
            lineLimit={1}
            minScaleFactor={0.55}
          >
            {formatUsage(value)}
          </Text>
        </VStack>
      ))}
    </HStack>
  )
}

export function CalendarCellView({
  day,
  value,
  isToday,
  isFuture,
  isMax,
  isMin,
  heat,
  width,
  height
}: {
  day: number
  value: number | null
  isToday: boolean
  isFuture: boolean
  isMax: boolean
  isMin: boolean
  heat: number
  width: number
  height: number
}) {
  if (day === 0) {
    return (
      <VStack
        frame={{ width, height }}
        background={<RoundedRectangle cornerRadius={px(12)} fill={BLANK_BG} />}
      />
    )
  }
  const valueColor = isToday
    ? AMBER_TEXT_ON_LIGHT
    : isMax
      ? RED_TEXT
      : isMin
        ? BLUE_TEXT
        : INK
  const cellBackground = isToday
    ? TODAY_BG
    : isMax
      ? MAX_BG
      : isMin
        ? MIN_BG
        : isFuture
          ? FUTURE_BG
          : HEAT_BG[Math.max(0, Math.min(3, heat))]
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={
        cellBackground ? (
          <RoundedRectangle cornerRadius={px(12)} fill={cellBackground} />
        ) : undefined
      }
    >
      <VStack
        alignment="leading"
        spacing={0}
        frame={{ width: width - px(8), height, alignment: 'leading' }}
      >
        <Rectangle fill={CLEAR} frame={{ width: 1, height: px(4) }} />
        <HStack spacing={px(3)} frame={{ width: width - px(8) }}>
          <Text
            font={px(14)}
            fontWeight="medium"
            foregroundStyle={isFuture ? FAINT : QUIET}
            lineLimit={1}
          >
            {day}
          </Text>
          <Spacer minLength={0} />
          {isToday ? (
            <Circle
              fill={AMBER_TEXT_ON_LIGHT}
              frame={{ width: px(4), height: px(4) }}
            />
          ) : null}
        </HStack>
        <Spacer minLength={0} />
        {value != null ? (
          <Text
            font={px(24)}
            fontWeight="semibold"
            foregroundStyle={valueColor}
            lineLimit={1}
            minScaleFactor={0.5}
            frame={{ maxWidth: 'infinity', alignment: 'trailing' }}
          >
            {formatUsage(value)}
          </Text>
        ) : null}
        <Rectangle fill={CLEAR} frame={{ width: 1, height: px(4) }} />
      </VStack>
    </VStack>
  )
}

export function LegendItem({
  color,
  text
}: {
  color: string
  text: string
}) {
  return (
    <HStack spacing={px(4)}>
      <Circle fill={color} frame={{ width: px(8), height: px(8) }} />
      <Text
        font={px(14)}
        fontWeight="medium"
        foregroundStyle={MUTED}
        lineLimit={1}
      >
        {text}
      </Text>
    </HStack>
  )
}
