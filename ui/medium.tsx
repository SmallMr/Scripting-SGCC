import { HStack, Rectangle, Spacer, VStack, Widget } from 'scripting'
import { recentCalendarDays, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  DailyChart,
  MetricTile,
  SectionTitle,
  TierPanel
} from './atoms'
import { WIDGET_BG, px } from './theme'
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
  const gap = px(8)
  const available = innerWidth - gap * 3
  const unit = available / 4.12
  const tileWidths = [unit * 0.78, unit * 0.9, unit * 1.22, unit * 1.22]
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
        logoSize={px(28)}
        fontSize={px(12)}
        gap={px(8)}
      />

      <HStack spacing={gap} frame={{ width: innerWidth, height: px(60) }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={tileWidths[0]}
          height={px(60)}
          labelSize={px(11)}
          valueSize={px(18)}
          unitSize={px(12)}
          gap={px(4)}
          inset={px(10)}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={tileWidths[1]}
          height={px(60)}
          labelSize={px(11)}
          valueSize={px(18)}
          unitSize={px(12)}
          gap={px(4)}
          inset={px(10)}
        />
        <MetricTile
          label="上月"
          value={summary.previousUsage}
          money={summary.previousCost}
          width={tileWidths[2]}
          height={px(60)}
          labelSize={px(11)}
          valueSize={px(18)}
          unitSize={px(12)}
          moneySize={px(12)}
          gap={px(4)}
          inset={px(10)}
        />
        <MetricTile
          label="本年"
          value={summary.yearUsage}
          money={summary.yearCost}
          width={tileWidths[3]}
          height={px(60)}
          labelSize={px(11)}
          valueSize={px(18)}
          unitSize={px(12)}
          moneySize={px(12)}
          gap={px(4)}
          inset={px(10)}
        />
      </HStack>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(8) }} />
      <SectionTitle
        title="最近14天"
        trailing="日用电量"
        titleSize={px(14)}
        trailingSize={px(11)}
      />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(5) }} />
      <DailyChart items={recent} width={innerWidth} height={px(80)} />
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
