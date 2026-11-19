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
        font={fontSize * 0.68}
        foregroundStyle={MONEY}
        lineLimit={1}
        minScaleFactor={0.7}
      >
        ¥
      </Text>
      <Text
        font={fontSize}
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
}

/** 上下结构的数据块，内容和底边、顶边的间距保持一致。 */
export function MetricTile({
  label,
  value,
  money,
  width,
  height,
  radius = px(14),
  labelSize = px(10),
  valueSize = px(17),
  unitSize = px(11),
  moneySize = px(11),
  gap = px(4),
  inset = px(10),
  divider = false
}: MetricTileProps) {
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={<RoundedRectangle cornerRadius={radius} fill={TILE} />}
    >
      <Spacer minLength={0} />
      <VStack
        alignment="leading"
        spacing={gap}
        frame={{ width: width - inset * 2, alignment: 'leading' }}
      >
        <Text
          font={labelSize}
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
        spacing={px(20)}
        frame={{
          width: width - inset * 2,
          height: height - (first ? 0 : px(1)),
          alignment: 'leading'
        }}
      >
        <Text
          font={labelSize}
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
  height = px(68)
}: {
  detail: string
  fraction: number
  width: number
  height?: number
}) {
  const insetX = px(11)
  const innerWidth = width - insetX * 2
  const gap = px(4)
  const segmentWidth = (innerWidth - gap * 2) / 3
  const knobSize = px(17)
  const trackHeight = px(18)
  const barHeight = px(9)
  const safeFraction = Math.max(0, Math.min(1, fraction))
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={<RoundedRectangle cornerRadius={px(15)} fill={TILE} />}
    >
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />
      <VStack
        alignment="leading"
        spacing={0}
        frame={{ width: innerWidth, height: height - px(8) - px(14) }}
      >
        <HStack spacing={px(8)} frame={{ maxWidth: 'infinity' }}>
          <Text
            font={px(12)}
            foregroundStyle={MUTED}
            lineLimit={1}
            minScaleFactor={0.7}
          >
            阶梯
          </Text>
          <Spacer minLength={0} />
          <Text
            font={px(12)}
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
            border={{ color: TIER_AMBER, width: px(3) }}
            offset={{
              x: innerWidth * safeFraction - knobSize / 2,
              y: 0
            }}
          />
        </ZStack>
      </VStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(14) }} />
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
      <Text font={titleSize} fontWeight="semibold" foregroundStyle={INK} lineLimit={1}>
        {title}
      </Text>
      <Spacer minLength={0} />
      <Text font={trailingSize} foregroundStyle={QUIET} lineLimit={1}>
        {trailing}
      </Text>
    </HStack>
  )
}

export function DailyChart({
  items,
  width,
  height = px(80)
}: {
  items: { day: number; value: number; isToday: boolean }[]
  width: number
  height?: number
}) {
  const gap = px(2)
  const columnWidth = (width - gap * 13) / 14
  const peak = Math.max(1, ...items.map(({ value }) => value))
  const barArea = px(48)
  return (
    <HStack spacing={gap} frame={{ width, height }}>
      {items.map(({ value, day, isToday }, index) => {
        return (
          <VStack
            key={`${index}-${value}`}
            spacing={px(3)}
            frame={{ width: columnWidth, height, alignment: 'center' }}
          >
            <Text
              font={px(9)}
              foregroundStyle={QUIET}
              lineLimit={1}
              minScaleFactor={0.55}
            >
              {day}
            </Text>
            <ZStack alignment="bottom" frame={{ width: columnWidth, height: barArea }}>
              <Capsule
                fill={
                  isToday
                    ? {
                        colors: ['#E9BF70', '#CF9330'],
                        startPoint: 'top',
                        endPoint: 'bottom'
                      }
                    : {
                        colors: ['#54C4AA', '#07866F'],
                        startPoint: 'top',
                        endPoint: 'bottom'
                      }
                }
                frame={{
                  width: px(12),
                  height: Math.max(px(6), (value / peak) * barArea)
                }}
              />
            </ZStack>
            <Text
              font={px(9)}
              fontWeight="medium"
              foregroundStyle={INK}
              lineLimit={1}
              minScaleFactor={0.55}
            >
              {formatUsage(value)}
            </Text>
          </VStack>
        )
      })}
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
  const fill = blank
    ? '#FFFFFF'
    : isFuture
      ? '#FCFDFD'
      : isToday
        ? '#FFF8EB'
        : isMax
          ? '#FFF4F2'
          : isMin
            ? '#F0F6FB'
            : '#F7FAF9'
  const border = blank || isFuture
    ? '#F0F3F2'
    : isToday
      ? '#E5BD76'
      : isMax
        ? '#E6A29A'
        : isMin
          ? '#A3BFD7'
          : '#E8EFEC'
  const valueColor = isToday
    ? '#92702F'
    : isMax
      ? '#BD554C'
      : isMin
        ? '#527FA7'
        : INK
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height, alignment: 'center' }}
      background={<RoundedRectangle cornerRadius={px(10)} fill={fill} />}
      border={{ color: border, width: px(1) }}
    >
      {!blank ? (
        <VStack
          alignment="leading"
          spacing={0}
          frame={{
            width: width - px(12),
            height: height - px(8),
            alignment: 'leading'
          }}
        >
          <Text
            font={px(9)}
            foregroundStyle={isFuture ? FAINT : QUIET}
            lineLimit={1}
          >
            {day}
          </Text>
          <Spacer minLength={0} />
          {value != null ? (
            <Text
              font={px(13)}
              fontWeight="medium"
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
      <RoundedRectangle
        cornerRadius={px(3)}
        fill={CLEAR}
        frame={{ width: px(10), height: px(10) }}
        border={{ color, width: px(1.5) }}
      />
      <Text font={px(10)} foregroundStyle={MUTED} lineLimit={1}>
        {text}
      </Text>
    </HStack>
  )
}
