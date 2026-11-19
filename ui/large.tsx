import { HStack, Rectangle, Spacer, Text, VStack, Widget } from 'scripting'
import { calendarForMonth, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  CalendarCellView,
  LegendItem,
  MetricTile,
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
  const calendar = calendarForMonth(summary.days)
  const cellGap = px(5)
  const cellWidth = (innerWidth - cellGap * 6) / 7
  const summaryDivider = px(1)
  const summaryWidth = (innerWidth - summaryDivider) / 2

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
        fontSize={px(19)}
        gap={px(10)}
      />

      <HStack
        alignment="top"
        spacing={px(12)}
        frame={{ width: innerWidth, height: px(140) }}
      >
        <VStack alignment="leading" spacing={px(6)}>
          <Text
            font={px(19)}
            fontWeight="medium"
            foregroundStyle={MUTED}
            lineLimit={1}
          >
            本月
          </Text>
          <UsageValue
            value={formatUsage(summary.monthUsage)}
            fontSize={px(92)}
            unitSize={px(24)}
          />
        </VStack>
        <Spacer minLength={0} />
        <Rectangle
          fill={LINE}
          frame={{ width: px(1), height: px(120) }}
        />
        <VStack alignment="leading" spacing={px(5)} frame={{ width: px(276) }}>
          <Text
            font={px(19)}
            fontWeight="medium"
            foregroundStyle={MUTED}
            lineLimit={1}
          >
            昨日
          </Text>
          <UsageValue
            value={formatUsage(summary.yesterdayUsage)}
            fontSize={px(40)}
            unitSize={px(18)}
          />
        </VStack>
      </HStack>
      <Rectangle fill={LINE} frame={{ width: innerWidth, height: px(1) }} />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(10) }} />

      <HStack spacing={px(16)} frame={{ width: innerWidth, height: px(24) }}>
        <Text
          font={px(20)}
          fontWeight="bold"
          foregroundStyle={INK}
          lineLimit={1}
        >
          本月每日用电
        </Text>
        <Spacer minLength={0} />
        <LegendItem color={RED} text="最高" />
        <LegendItem color={BLUE} text="最低" />
        <LegendItem color={AMBER} text="今天" />
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />

      <HStack spacing={cellGap} frame={{ width: innerWidth, height: px(20) }}>
        {WEEKDAYS.map((name) => (
          <Text
            key={name}
            font={px(16)}
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
            frame={{ width: innerWidth, height: px(41) }}
          >
            {calendar.cells.slice(row * 7, row * 7 + 7).map((cell) => (
              <CalendarCellView
                day={cell.day}
                value={cell.value}
                isToday={cell.isToday}
                isFuture={cell.isFuture}
                isMax={cell.isMax}
                isMin={cell.isMin}
                width={cellWidth}
                height={px(41)}
              />
            ))}
          </HStack>
        ))}
      </VStack>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />

      <HStack spacing={0} frame={{ width: innerWidth, height: px(70) }}>
        <MetricTile
          label="上月"
          value={summary.previousUsage}
          money={summary.previousCost}
          width={summaryWidth}
          height={px(70)}
          labelSize={px(18)}
          valueSize={px(36)}
          unitSize={px(17)}
          moneySize={px(20)}
          gap={px(4)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: summaryDivider, height: px(44) }}
        />
        <MetricTile
          label="本年"
          value={summary.yearUsage}
          money={summary.yearCost}
          width={summaryWidth}
          height={px(70)}
          labelSize={px(18)}
          valueSize={px(36)}
          unitSize={px(17)}
          moneySize={px(20)}
          gap={px(4)}
          inset={0}
        />
      </HStack>

      <Spacer minLength={0} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        height={px(56)}
      />
    </VStack>
  )
}
