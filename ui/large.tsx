import {
  Circle,
  HStack,
  Rectangle,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  Widget
} from 'scripting'
import { calendarForMonth, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  CalendarCellView,
  HeroMetaLine,
  HeroSurface,
  LegendItem,
  TierPanel,
  UsageValue
} from './atoms'
import {
  AMBER,
  BLUE,
  INK,
  LINE,
  MUTED,
  QUIET,
  RED,
  TIER_AMBER,
  TIER_GREEN,
  TIER_THIRD,
  UNIT,
  WIDGET_BG,
  formatUsage,
  px
} from './theme'
import type { WidgetViewProps } from './model'

const CLEAR = 'rgba(0,0,0,0)'
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export function LargeWidgetView({
  summary,
  settings,
  syncedAt
}: WidgetViewProps) {
  const width = Widget.displaySize.width
  const padding = px(24)
  const innerWidth = width - padding * 2
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
  const accent =
    tier.tier === 1 ? TIER_GREEN : tier.tier === 2 ? TIER_AMBER : TIER_THIRD
  const calendar = calendarForMonth(summary.days)
  const cellGap = px(4)
  const cellWidth = (innerWidth - cellGap * 6) / 7
  const rowHeight = px(54)
  const values = calendar.cells
    .map((cell) => cell.value)
    .filter((value): value is number => value != null && value > 0)
  const peak = Math.max(1, ...values)
  const heatFor = (value: number) => {
    const ratio = value / peak
    if (ratio > 0.75) return 3
    if (ratio > 0.5) return 2
    if (ratio > 0.25) return 1
    return 0
  }

  return (
    <VStack
      alignment="leading"
      spacing={0}
      padding={padding}
      frame={{ maxWidth: 'infinity', maxHeight: 'infinity' }}
      widgetBackground={WIDGET_BG}
    >
      <BrandHeader
        syncedAt={syncedAt}
        logoSize={px(36)}
        fontSize={px(18)}
        gap={px(8)}
      />

      <HeroSurface
        width={innerWidth}
        height={px(144)}
        inset={px(16)}
      >
        <VStack alignment="leading" spacing={px(2)}>
          <HStack spacing={px(6)}>
            <CircleMark />
            <Text
              font={px(18)}
              fontWeight="medium"
              foregroundStyle={MUTED}
              lineLimit={1}
            >
              本月
            </Text>
          </HStack>
          <UsageValue
            value={formatUsage(summary.monthUsage)}
            fontSize={px(76)}
            unitSize={px(22)}
            color={INK}
            unitColor={UNIT}
            weight="bold"
          />
        </VStack>
        <Spacer minLength={0} />
        <Rectangle
          fill={LINE}
          frame={{ width: px(1), height: px(112) }}
        />
        <VStack
          alignment="leading"
          spacing={px(3)}
          frame={{ width: px(270) }}
        >
          <HeroMetaLine
            label="昨日"
            value={summary.yesterdayUsage}
            labelWidth={px(34)}
            labelSize={px(16)}
            valueSize={px(28)}
            unitSize={px(13)}
            moneySize={px(17)}
          />
          <HeroMetaLine
            label="上月"
            value={summary.previousUsage}
            money={summary.previousCost}
            labelWidth={px(34)}
            labelSize={px(16)}
            valueSize={px(28)}
            unitSize={px(13)}
            moneySize={px(17)}
          />
        </VStack>
      </HeroSurface>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(10) }} />
      <HStack
        spacing={px(7)}
        frame={{ width: innerWidth, height: px(24) }}
      >
        <RoundedRectangle
          cornerRadius={px(2)}
          fill={TIER_GREEN}
          frame={{ width: px(4), height: px(18) }}
        />
        <Text
          font={px(19)}
          fontWeight="bold"
          foregroundStyle={INK}
          lineLimit={1}
        >
          本月每日用电
        </Text>
        <Text
          font={px(13)}
          fontWeight="medium"
          foregroundStyle={QUIET}
          lineLimit={1}
        >
          单位：度
        </Text>
        <Spacer minLength={0} />
        <LegendItem color={RED} text="最高" />
        <LegendItem color={BLUE} text="最低" />
        <LegendItem color={AMBER} text="今天" />
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />

      <HStack
        spacing={cellGap}
        frame={{ width: innerWidth, height: px(18) }}
      >
        {WEEKDAYS.map((name) => (
          <Text
            key={name}
            font={px(14)}
            fontWeight="medium"
            foregroundStyle={QUIET}
            lineLimit={1}
            frame={{ width: cellWidth, alignment: 'center' }}
          >
            {name}
          </Text>
        ))}
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(4) }} />

      <VStack alignment="leading" spacing={cellGap} frame={{ width: innerWidth }}>
        {Array.from({ length: 6 }, (_, row) => (
          <HStack
            key={row}
            spacing={cellGap}
            frame={{ width: innerWidth, height: rowHeight }}
          >
            {calendar.cells.slice(row * 7, row * 7 + 7).map((cell) => (
              <CalendarCellView
                day={cell.day}
                value={cell.value}
                isToday={cell.isToday}
                isFuture={cell.isFuture}
                isMax={cell.isMax}
                isMin={cell.isMin}
                heat={cell.value != null ? heatFor(cell.value) : 0}
                width={cellWidth}
                height={rowHeight}
              />
            ))}
          </HStack>
        ))}
      </VStack>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        accent={accent}
        height={px(60)}
      />
    </VStack>
  )
}

function CircleMark() {
  return <Circle fill={TIER_GREEN} frame={{ width: px(6), height: px(6) }} />
}
