import {
  Circle,
  HStack,
  Rectangle,
  Spacer,
  Text,
  VStack,
  Widget
} from 'scripting'
import { recentCalendarDays, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  DailyBars,
  HeroMetaLine,
  HeroSurface,
  SectionTitle,
  TierPanel,
  UsageValue
} from './atoms'
import {
  INK,
  LINE,
  MUTED,
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

export function WideWidgetView({
  summary,
  settings,
  syncedAt
}: WidgetViewProps) {
  const width = Widget.displaySize.width
  const padding = px(16)
  const innerWidth = width - padding * 2
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
  const accent =
    tier.tier === 1 ? TIER_GREEN : tier.tier === 2 ? TIER_AMBER : TIER_THIRD
  const recent = recentCalendarDays(summary.days, 7)

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
        fontSize={px(15)}
        gap={px(4)}
      />

      <HeroSurface
        width={innerWidth}
        height={px(86)}
        inset={px(12)}
      >
        <VStack alignment="leading" spacing={px(1)}>
          <HStack spacing={px(5)}>
            <Circle
              fill={TIER_GREEN}
              frame={{ width: px(5), height: px(5) }}
            />
            <Text
              font={px(15)}
              fontWeight="medium"
              foregroundStyle={MUTED}
              lineLimit={1}
            >
              本月
            </Text>
          </HStack>
          <UsageValue
            value={formatUsage(summary.monthUsage)}
            fontSize={px(50)}
            unitSize={px(15)}
            color={INK}
            unitColor={UNIT}
            weight="bold"
          />
        </VStack>
        <Spacer minLength={0} />
        <Rectangle
          fill={LINE}
          frame={{ width: px(1), height: px(64) }}
        />
        <VStack
          alignment="leading"
          spacing={px(1)}
          frame={{ width: px(290) }}
        >
          <HeroMetaLine
            label="昨日"
            value={summary.yesterdayUsage}
            labelWidth={px(32)}
            labelSize={px(14)}
            valueSize={px(20)}
            unitSize={px(11)}
            moneySize={px(14)}
          />
          <HeroMetaLine
            label="上月"
            value={summary.previousUsage}
            money={summary.previousCost}
            labelWidth={px(32)}
            labelSize={px(14)}
            valueSize={px(20)}
            unitSize={px(11)}
            moneySize={px(14)}
          />
          <HeroMetaLine
            label="本年"
            value={summary.yearUsage}
            money={summary.yearCost}
            labelWidth={px(32)}
            labelSize={px(14)}
            valueSize={px(20)}
            unitSize={px(11)}
            moneySize={px(14)}
          />
        </VStack>
      </HeroSurface>

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(5) }} />
      <SectionTitle
        title="最近7天"
        trailing="日用电量 · 度"
        titleSize={px(17)}
        trailingSize={px(13)}
        height={px(18)}
      />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(2) }} />
      <DailyBars items={recent} width={innerWidth} height={px(82)} />

      <Rectangle fill={CLEAR} frame={{ width: 1, height: px(5) }} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        accent={accent}
        height={px(54)}
      />
    </VStack>
  )
}
