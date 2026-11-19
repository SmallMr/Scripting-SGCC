import {
  Circle,
  HStack,
  Rectangle,
  Spacer,
  Text,
  VStack,
  Widget
} from 'scripting'
import { tierDisplay } from '../core/usage'
import type { CompactStyle } from '../core/settings'
import {
  BrandHeader,
  DataRow,
  HeroSurface,
  MetaLine,
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

function SmallHero({
  props,
  width,
  height,
  monthSize,
  yesterdaySize
}: {
  props: WidgetViewProps
  width: number
  height: number
  monthSize: number
  yesterdaySize: number
}) {
  const { summary } = props
  return (
    <HeroSurface
      width={width}
      height={height}
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
          fontSize={monthSize}
          unitSize={px(15)}
          color={INK}
          unitColor={UNIT}
          weight="bold"
        />
      </VStack>
      <Spacer minLength={0} />
      <Rectangle
        fill={LINE}
        frame={{ width: px(1), height: px(60) }}
      />
      <VStack alignment="leading" spacing={px(1)}>
        <Text
          font={px(14)}
          fontWeight="medium"
          foregroundStyle={MUTED}
          lineLimit={1}
        >
          昨日
        </Text>
        <UsageValue
          value={formatUsage(summary.yesterdayUsage)}
          fontSize={yesterdaySize}
          unitSize={px(12)}
          color={INK}
          unitColor={UNIT}
        />
      </VStack>
    </HeroSurface>
  )
}

function RowsLayout({
  props,
  width,
  height,
  rowHeight,
  valueSize,
  moneySize
}: {
  props: WidgetViewProps
  width: number
  height: number
  rowHeight: number
  valueSize: number
  moneySize: number
}) {
  const { summary } = props
  return (
    <VStack alignment="leading" spacing={0} frame={{ width, height }}>
      <HStack
        alignment="lastTextBaseline"
        frame={{ width, height: rowHeight, alignment: 'leading' }}
      >
        <MetaLine
          label="上月"
          value={summary.previousUsage}
          money={summary.previousCost}
          labelWidth={px(34)}
          labelSize={px(16)}
          valueSize={valueSize}
          unitSize={px(12)}
          moneySize={moneySize}
          fill
        />
      </HStack>
      <Rectangle fill={LINE} frame={{ width, height: px(1) }} />
      <HStack
        alignment="lastTextBaseline"
        frame={{ width, height: height - rowHeight - px(1), alignment: 'leading' }}
      >
        <MetaLine
          label="本年"
          value={summary.yearUsage}
          money={summary.yearCost}
          labelWidth={px(34)}
          labelSize={px(16)}
          valueSize={valueSize}
          unitSize={px(12)}
          moneySize={moneySize}
          fill
        />
      </HStack>
    </VStack>
  )
}

export function CompactWidgetView(props: WidgetViewProps) {
  const { summary, settings, syncedAt } = props
  const width = Widget.displaySize.width
  const height = Widget.displaySize.height
  const padding = px(16)
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const brandHeight = px(26)
  const brandGap = px(4)
  const tierGap = px(6)
  const tierHeight = px(54)
  const contentHeight =
    innerHeight - brandHeight - brandGap - tierGap - tierHeight
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
  const accent =
    tier.tier === 1 ? TIER_GREEN : tier.tier === 2 ? TIER_AMBER : TIER_THIRD
  const mode: CompactStyle = settings.smallWidgetMode || 'modules'

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
        logoSize={brandHeight}
        fontSize={px(15)}
        gap={brandGap}
      />

      {mode === 'compact' ? (
        <VStack
          alignment="center"
          spacing={0}
          frame={{ width: innerWidth, height: contentHeight }}
        >
          <DataRow
            label="昨日"
            value={summary.yesterdayUsage}
            width={innerWidth}
            height={contentHeight / 4}
            first
            labelWidth={px(38)}
            labelSize={px(16)}
            valueSize={px(26)}
            unitSize={px(13)}
            moneySize={px(16)}
          />
          <DataRow
            label="本月"
            value={summary.monthUsage}
            width={innerWidth}
            height={contentHeight / 4}
            labelWidth={px(38)}
            labelSize={px(16)}
            valueSize={px(26)}
            unitSize={px(13)}
            moneySize={px(16)}
          />
          <DataRow
            label="上月"
            value={summary.previousUsage}
            money={summary.previousCost}
            width={innerWidth}
            height={contentHeight / 4}
            labelWidth={px(38)}
            labelSize={px(16)}
            valueSize={px(26)}
            unitSize={px(13)}
            moneySize={px(16)}
          />
          <DataRow
            label="本年"
            value={summary.yearUsage}
            money={summary.yearCost}
            width={innerWidth}
            height={contentHeight / 4}
            labelWidth={px(38)}
            labelSize={px(16)}
            valueSize={px(26)}
            unitSize={px(13)}
            moneySize={px(16)}
          />
        </VStack>
      ) : mode === 'three' ? (
        <VStack
          alignment="leading"
          spacing={0}
          frame={{ width: innerWidth, height: contentHeight }}
        >
          <SmallHero
            props={props}
            width={innerWidth}
            height={px(138)}
            monthSize={px(56)}
            yesterdaySize={px(28)}
          />
          <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />
          <HStack
            alignment="lastTextBaseline"
            frame={{ width: innerWidth, height: px(48), alignment: 'leading' }}
          >
            <MetaLine
              label="上月"
              value={summary.previousUsage}
              money={summary.previousCost}
              labelWidth={px(36)}
              labelSize={px(17)}
              valueSize={px(29)}
              unitSize={px(14)}
              moneySize={px(18)}
              fill
            />
          </HStack>
        </VStack>
      ) : (
        <VStack
          alignment="leading"
          spacing={0}
          frame={{ width: innerWidth, height: contentHeight }}
        >
          <SmallHero
            props={props}
            width={innerWidth}
            height={px(104)}
            monthSize={px(46)}
            yesterdaySize={px(26)}
          />
          <Rectangle fill={CLEAR} frame={{ width: 1, height: px(6) }} />
          <RowsLayout
            props={props}
            width={innerWidth}
            height={px(82)}
            rowHeight={px(41)}
            valueSize={px(24)}
            moneySize={px(15)}
          />
        </VStack>
      )}

      <Rectangle fill={CLEAR} frame={{ width: 1, height: tierGap }} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        accent={accent}
        height={tierHeight}
      />
    </VStack>
  )
}
