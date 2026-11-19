import { HStack, Rectangle, Spacer, Text, VStack, Widget } from 'scripting'
import { calendarForMonth, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  CalendarCellView,
  LegendItem,
  MetricTile,
  SectionTitle,
  TierPanel,
  UsageValue
} from './atoms'
import {
  AMBER,
  BLUE,
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
  const summaryGap = px(10)
  const summaryWidth = (innerWidth - summaryGap) / 2

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
        fontSize={px(12)}
        gap={px(14)}
      />

      <HStack
        alignment="center"
        spacing={px(12)}
        frame={{ width: innerWidth, height: px(80) }}
      >
        <VStack alignment="leading" spacing={px(5)}>
          <Text font={px(12)} foregroundStyle={MUTED} lineLimit={1}>
            本月
          </Text>
          <UsageValue
            value={formatUsage(summary.monthUsage)}
            fontSize={px(48)}
            unitSize={px(11)}
          />
        </VStack>
        <Spacer minLength={0} />
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={px(138)}
          height={px(58)}
          radius={px(15)}
          labelSize={px(12)}
          valueSize={px(23)}
          unitSize={px(11)}
          gap={px(5)}
          inset={px(14)}
        />
      </HStack>
      <Rectangle fill={LINE} frame={{ width: innerWidth, height: px(1) }} />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(12) }} />

      <SectionTitle
        title="本月每日用电"
        trailing="单位：度"
        titleSize={px(14)}
        trailingSize={px(10)}
      />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />

      <HStack spacing={cellGap} frame={{ width: innerWidth, height: px(16) }}>
        {WEEKDAYS.map((name) => (
          <Text
            key={name}
            font={px(10)}
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
            frame={{ width: innerWidth, height: px(42) }}
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
                height={px(42)}
              />
            ))}
          </HStack>
        ))}
      </VStack>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />
      <HStack spacing={px(17)} frame={{ width: innerWidth, height: px(12) }}>
        <LegendItem color={RED} text="最高" />
        <LegendItem color={BLUE} text="最低" />
        <LegendItem color={AMBER} text="今天" />
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(10) }} />

      <HStack spacing={summaryGap} frame={{ width: innerWidth, height: px(58) }}>
        <MetricTile
          label="上月"
          value={summary.previousUsage}
          money={summary.previousCost}
          width={summaryWidth}
          height={px(58)}
          radius={px(15)}
          labelSize={px(10)}
          valueSize={px(19)}
          unitSize={px(11)}
          moneySize={px(12)}
          gap={px(5)}
          inset={px(12)}
        />
        <MetricTile
          label="本年"
          value={summary.yearUsage}
          money={summary.yearCost}
          width={summaryWidth}
          height={px(58)}
          radius={px(15)}
          labelSize={px(10)}
          valueSize={px(19)}
          unitSize={px(11)}
          moneySize={px(12)}
          gap={px(5)}
          inset={px(12)}
        />
      </HStack>

      <Spacer minLength={0} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        height={px(68)}
      />
    </VStack>
  )
}
