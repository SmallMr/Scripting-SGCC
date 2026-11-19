import { HStack, Rectangle, Spacer, VStack, Widget } from 'scripting'
import { recentCalendarDays, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  DailyGrid,
  MetricTile,
  SectionTitle,
  TierPanel
} from './atoms'
import { LINE, WIDGET_BG, px } from './theme'
import type { WidgetViewProps } from './model'

const CLEAR = 'rgba(0,0,0,0)'

export function WideWidgetView({
  summary,
  settings,
  syncedAt
}: WidgetViewProps) {
  const width = Widget.displaySize.width
  const padding = px(16)
  const innerWidth = width - padding * 2
  const dividerWidth = px(1)
  const available = innerWidth - dividerWidth * 3
  const tileWidths = [
    available * 0.15,
    available * 0.22,
    available * 0.3,
    available * 0.33
  ]
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
  const recent = recentCalendarDays(summary.days, 14)

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
        logoSize={px(30)}
        fontSize={px(17)}
        gap={px(6)}
      />

      <HStack spacing={0} frame={{ width: innerWidth, height: px(68) }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={tileWidths[0]}
          height={px(68)}
          labelSize={px(17)}
          valueSize={px(33)}
          unitSize={px(16)}
          gap={px(6)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: dividerWidth, height: px(48) }}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={tileWidths[1]}
          height={px(68)}
          labelSize={px(17)}
          valueSize={px(33)}
          unitSize={px(16)}
          gap={px(6)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: dividerWidth, height: px(48) }}
        />
        <MetricTile
          label="上月"
          value={summary.previousUsage}
          money={summary.previousCost}
          width={tileWidths[2]}
          height={px(68)}
          labelSize={px(17)}
          valueSize={px(33)}
          unitSize={px(16)}
          moneySize={px(19)}
          gap={px(6)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: dividerWidth, height: px(48) }}
        />
        <MetricTile
          label="本年"
          value={summary.yearUsage}
          money={summary.yearCost}
          width={tileWidths[3]}
          height={px(68)}
          labelSize={px(17)}
          valueSize={px(33)}
          unitSize={px(16)}
          moneySize={px(19)}
          gap={px(6)}
          inset={0}
        />
      </HStack>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />
      <SectionTitle
        title="最近14天"
        trailing="日用电量"
        titleSize={px(19)}
        trailingSize={px(16)}
      />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(2) }} />
      <DailyGrid items={recent} width={innerWidth} height={px(90)} />
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
