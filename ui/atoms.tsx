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
  AMBER_TEXT,
  FAINT,
  GRID_MARK_URL,
  INK,
  LINE,
  MONEY,
  MUTED,
  QUIET,
  TIER_AMBER,
  TIER_GREEN,
  TIER_REST,
  TILE,
  UNIT,
  formatMoney,
  formatUsage,
  monthStamp,
  px
} from './theme'

const CLEAR = 'rgba(0,0,0,0)'

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
/** 左上角品牌标识，右上角月份和更新时间；不再重复“国家电网”文字。 */
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
        <Text
          font={fontSize}
          fontWeight="medium"
          foregroundStyle={QUIET}
          lineLimit={1}
          minScaleFactor={0.7}
        >
          {monthStamp(syncedAt)}
        </Text>
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
  weight = 'semibold',
  align = 'leading'
}: {
  value: number | string
  fontSize: number
  unitSize: number
  color?: unknown
  weight?: string
  align?: 'leading' | 'trailing' | 'center'
}) {
  return (
    <HStack alignment="lastTextBaseline" spacing={px(3)}>
      <Text
        font={fontSize}
        fontWeight={weight}
        foregroundStyle={color}
        lineLimit={1}
        minScaleFactor={0.55}
        multilineTextAlignment={align}
      >
        {value}
      </Text>
      <Text
        font={unitSize}
        fontWeight="medium"
        foregroundStyle={UNIT}
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
  fontSize
}: {
  value: number | string
  fontSize: number
}) {
  return (
    <HStack alignment="lastTextBaseline" spacing={px(1)}>
      <Text
        font={fontSize * 0.62}
        fontWeight="medium"
        foregroundStyle={MONEY}
        lineLimit={1}
        minScaleFactor={0.7}
      >
        ¥
      </Text>
      <Text
        font={fontSize}
        fontWeight="medium"
        foregroundStyle={MONEY}
        lineLimit={1}
        minScaleFactor={0.65}
      >
        {formatMoney(value)}
      </Text>
    </HStack>
  )
}

type MetricTileProps = {
  label: string
  value: number
  money?: number | string
  width: number
  height: number
  radius?: number
  labelSize?: number
  valueSize?: number
  unitSize?: number
  moneySize?: number
  gap?: number
  inset?: number
  divider?: boolean
  surface?: boolean
}

/** 上下结构的数据块，内容和底边、顶边的间距保持一致。 */
export function MetricTile({
  label,
  value,
  money,
  width,
  height,
  radius = px(14),
  labelSize = px(11),
  valueSize = px(18),
  unitSize = px(12),
  moneySize = px(12),
  gap = px(4),
  inset = px(10),
  divider = false,
  surface = false
}: MetricTileProps) {
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={
        surface ? (
          <RoundedRectangle cornerRadius={radius} fill={TILE} />
        ) : undefined
      }
      border={
        surface ? { color: LINE, width: px(1.5) } : undefined
      }
    >
      <Spacer minLength={0} />
      <VStack
        alignment="leading"
        spacing={gap}
        frame={{ width: width - inset * 2, alignment: 'leading' }}
      >
        <Text
          font={labelSize}
          fontWeight="medium"
          foregroundStyle={MUTED}
          lineLimit={1}
          minScaleFactor={0.7}
        >
          {label}
        </Text>
        <HStack alignment="lastTextBaseline" spacing={px(6)}>
          <UsageValue
            value={formatUsage(value)}
            fontSize={valueSize}
            unitSize={unitSize}
          />
          <Spacer minLength={0} />
          {money != null && divider ? (
            <Rectangle
              fill={LINE}
              frame={{ width: px(1), height: px(22) }}
            />
          ) : null}
          {money != null ? (
            <MoneyAmount value={money} fontSize={moneySize} />
          ) : null}
        </HStack>
      </VStack>
      <Spacer minLength={0} />
    </VStack>
  )
}

/** 小号列表模式的每一行。 */
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
  inset,
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
  inset: number
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
        spacing={px(12)}
        frame={{
          width: width - inset * 2,
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
        <UsageValue
          value={formatUsage(value)}
          fontSize={valueSize}
          unitSize={unitSize}
        />
        <Spacer minLength={0} />
        {money != null ? <MoneyAmount value={money} fontSize={moneySize} /> : null}
      </HStack>
    </VStack>
  )
}

/** 三档阶梯固定在同样的宽度里，圆点表示当前年度累计位置。 */
export function TierPanel({
  detail,
  fraction,
  width,
  height = px(56)
}: {
  detail: string
  fraction: number
  width: number
  height?: number
}) {
  const insetX = 0
  const innerWidth = width - insetX * 2
  const gap = px(4)
  const segmentWidth = (innerWidth - gap * 2) / 3
  const knobSize = px(15)
  const trackHeight = px(18)
  const barHeight = px(9)
  const safeFraction = Math.max(0, Math.min(1, fraction))
  const knobCenter = Math.min(
    innerWidth - knobSize / 2,
    Math.max(knobSize / 2, innerWidth * safeFraction)
  )
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
    >
      <Rectangle fill={LINE} frame={{ width, height: px(1) }} />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(5) }} />
      <VStack
        alignment="leading"
        spacing={0}
        frame={{
          width: innerWidth,
          height: height - px(1) - px(5) - px(6)
        }}
      >
        <HStack spacing={px(8)} frame={{ maxWidth: 'infinity', height: px(24) }}>
          <Text
            font={px(18)}
            fontWeight="medium"
            foregroundStyle={MUTED}
            lineLimit={1}
            minScaleFactor={0.7}
          >
            阶梯
          </Text>
          <Spacer minLength={0} />
          <Text
            font={px(18)}
            fontWeight="semibold"
            foregroundStyle={AMBER_TEXT}
            lineLimit={1}
            minScaleFactor={0.58}
            multilineTextAlignment="trailing"
          >
            {detail}
          </Text>
        </HStack>
        <Spacer minLength={0} />
        <ZStack
          alignment="leading"
          frame={{ width: innerWidth, height: trackHeight }}
        >
          <HStack
            spacing={gap}
            frame={{ width: innerWidth, height: barHeight }}
          >
            <Capsule fill={TIER_GREEN} frame={{ width: segmentWidth, height: barHeight }} />
            <Capsule fill={TIER_AMBER} frame={{ width: segmentWidth, height: barHeight }} />
            <Capsule fill={TIER_REST} frame={{ width: segmentWidth, height: barHeight }} />
          </HStack>
          <Circle
            fill="#FFFFFF"
            frame={{ width: knobSize, height: knobSize }}
            border={{ color: TIER_AMBER, width: px(4) }}
            offset={{
              x: knobCenter - knobSize / 2,
              y: 0
            }}
          />
        </ZStack>
      </VStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />
    </VStack>
  )
}

export function SectionTitle({
  title,
  trailing,
  titleSize = px(14),
  trailingSize = px(10)
}: {
  title: string
  trailing: string
  titleSize?: number
  trailingSize?: number
}) {
  return (
    <HStack spacing={px(8)} frame={{ maxWidth: 'infinity' }}>
      <Text font={titleSize} fontWeight="bold" foregroundStyle={INK} lineLimit={1}>
        {title}
      </Text>
      <Spacer minLength={0} />
      <Text
        font={trailingSize}
        fontWeight="medium"
        foregroundStyle={QUIET}
        lineLimit={1}
      >
        {trailing}
      </Text>
    </HStack>
  )
}

/** 两行七列，避免 14 根细柱把日期和数值挤在一起。 */
export function DailyGrid({
  items,
  width,
  height = px(88)
}: {
  items: { day: number; value: number; isToday: boolean }[]
  width: number
  height?: number
}) {
  const columns = 7
  const rowGap = px(4)
  const columnWidth = width / columns
  const rowHeight = (height - rowGap) / 2
  const chunks = [items.slice(0, columns), items.slice(columns, columns * 2)]
  return (
    <VStack alignment="leading" spacing={rowGap} frame={{ width, height }}>
      {chunks.map((chunk, row) => (
        <HStack
          key={row}
          spacing={0}
          frame={{ width, height: rowHeight }}
        >
          {chunk.map(({ value, day, isToday }, index) => (
            <VStack
              key={`${row}-${index}-${day}`}
              alignment="leading"
              spacing={0}
              frame={{
                width: columnWidth,
                height: rowHeight,
                alignment: 'leading'
              }}
            >
              <Text
                font={px(14)}
                fontWeight="medium"
                foregroundStyle={QUIET}
                lineLimit={1}
              >
                {day}
              </Text>
              <Spacer minLength={0} />
              <HStack alignment="lastTextBaseline" spacing={px(2)}>
                <Text
                  font={px(21)}
                  fontWeight="semibold"
                  foregroundStyle={isToday ? AMBER_TEXT : INK}
                  lineLimit={1}
                  minScaleFactor={0.6}
                >
                  {formatUsage(value)}
                </Text>
                <Text
                  font={px(13)}
                  fontWeight="medium"
                  foregroundStyle={UNIT}
                  lineLimit={1}
                >
                  度
                </Text>
              </HStack>
            </VStack>
          ))}
        </HStack>
      ))}
    </VStack>
  )
}

export function CalendarCellView({
  day,
  value,
  isToday,
  isFuture,
  isMax,
  isMin,
  width,
  height
}: {
  day: number
  value: number | null
  isToday: boolean
  isFuture: boolean
  isMax: boolean
  isMin: boolean
  width: number
  height: number
}) {
  const blank = day === 0
  const valueColor = isToday
    ? '#7D5A1A'
    : isMax
      ? '#AE4037'
      : isMin
        ? '#3C6F9E'
        : INK
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={
        isToday ? (
          <RoundedRectangle cornerRadius={px(10)} fill="#FFF4DF" />
        ) : undefined
      }
    >
      {!blank ? (
        <VStack
          alignment="leading"
          spacing={0}
          frame={{
            width: width - px(6),
            height,
            alignment: 'leading'
          }}
        >
          <Text
            font={px(14)}
            fontWeight="medium"
            foregroundStyle={isFuture ? FAINT : QUIET}
            lineLimit={1}
          >
            {day}
          </Text>
          <Spacer minLength={0} />
          {value != null ? (
            <Text
            font={px(20)}
              fontWeight="semibold"
              foregroundStyle={valueColor}
              lineLimit={1}
              minScaleFactor={0.55}
              frame={{ maxWidth: 'infinity', alignment: 'trailing' }}
            >
              {formatUsage(value)}
            </Text>
          ) : null}
        </VStack>
      ) : null}
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
    <HStack spacing={px(6)}>
      <Circle fill={color} frame={{ width: px(9), height: px(9) }} />
      <Text
        font={px(11)}
        fontWeight="medium"
        foregroundStyle={MUTED}
        lineLimit={1}
      >
        {text}
      </Text>
    </HStack>
  )
}
