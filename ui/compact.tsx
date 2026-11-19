import {
  HStack,
  Rectangle,
  RoundedRectangle,
  VStack,
  Widget
} from 'scripting'
import { tierDisplay } from '../core/usage'
import type { CompactStyle } from '../core/settings'
import {
  BrandHeader,
  DataRow,
  MetricTile,
  TierPanel
} from './atoms'
import { WIDGET_BG, px } from './theme'
import type { WidgetViewProps } from './model'

const CLEAR = 'rgba(0,0,0,0)'

function ThreeItemLayout({
  props,
  width,
  height
}: {
  props: WidgetViewProps
  width: number
  height: number
}) {
  const { summary } = props
  const gap = px(7)
  const rowHeight = (height - gap) / 2
  const halfWidth = (width - gap) / 2
  return (
    <VStack alignment="leading" spacing={gap} frame={{ width, height }}>
      <HStack spacing={gap} frame={{ width, height: rowHeight }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={halfWidth}
          height={rowHeight}
          labelSize={px(11)}
          valueSize={px(24)}
          unitSize={px(10)}
          gap={px(6)}
          inset={px(12)}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={halfWidth}
          height={rowHeight}
          labelSize={px(11)}
          valueSize={px(24)}
          unitSize={px(10)}
          gap={px(6)}
          inset={px(12)}
        />
      </HStack>
      <MetricTile
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={rowHeight}
        labelSize={px(11)}
        valueSize={px(24)}
        unitSize={px(10)}
        moneySize={px(14)}
        gap={px(6)}
        inset={px(12)}
        divider
      />
    </VStack>
  )
}

function FourRowLayout({
  props,
  width,
  height
}: {
  props: WidgetViewProps
  width: number
  height: number
}) {
  const { summary } = props
  const rowHeight = height / 4
  return (
    <VStack
      alignment="center"
      spacing={0}
      frame={{ width, height }}
      background={
        <RoundedRectangle cornerRadius={px(14)} fill="#F3F7F6" />
      }
    >
      <DataRow
        label="昨日"
        value={summary.yesterdayUsage}
        width={width}
        height={rowHeight}
        first
        labelWidth={px(24)}
        labelSize={px(11)}
        valueSize={px(21)}
        unitSize={px(10)}
        moneySize={px(11.5)}
        inset={px(12)}
      />
      <DataRow
        label="本月"
        value={summary.monthUsage}
        width={width}
        height={rowHeight}
        labelWidth={px(24)}
        labelSize={px(11)}
        valueSize={px(21)}
        unitSize={px(10)}
        moneySize={px(11.5)}
        inset={px(12)}
      />
      <DataRow
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={rowHeight}
        labelWidth={px(24)}
        labelSize={px(11)}
        valueSize={px(21)}
        unitSize={px(10)}
        moneySize={px(11.5)}
        inset={px(12)}
      />
      <DataRow
        label="本年"
        value={summary.yearUsage}
        money={summary.yearCost}
        width={width}
        height={rowHeight}
        labelWidth={px(24)}
        labelSize={px(11)}
        valueSize={px(21)}
        unitSize={px(10)}
        moneySize={px(11.5)}
        inset={px(12)}
      />
    </VStack>
  )
}

function FourModuleLayout({
  props,
  width,
  height
}: {
  props: WidgetViewProps
  width: number
  height: number
}) {
  const { summary } = props
  const gap = px(6)
  const topHeight = px(50)
  const ticketHeight = (height - topHeight - gap * 2) / 2
  const halfWidth = (width - gap) / 2
  return (
    <VStack alignment="leading" spacing={gap} frame={{ width, height }}>
      <HStack spacing={gap} frame={{ width, height: topHeight }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={halfWidth}
          height={topHeight}
          labelSize={px(10.5)}
          valueSize={px(19)}
          unitSize={px(9)}
          gap={px(3)}
          inset={px(12)}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={halfWidth}
          height={topHeight}
          labelSize={px(10.5)}
          valueSize={px(19)}
          unitSize={px(9)}
          gap={px(3)}
          inset={px(12)}
        />
      </HStack>
      <MetricTile
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={ticketHeight}
        labelSize={px(10.5)}
        valueSize={px(20)}
        unitSize={px(10)}
        moneySize={px(12)}
        gap={px(3)}
        inset={px(12)}
      />
      <MetricTile
        label="本年"
        value={summary.yearUsage}
        money={summary.yearCost}
        width={width}
        height={ticketHeight}
        labelSize={px(10.5)}
        valueSize={px(20)}
        unitSize={px(10)}
        moneySize={px(12)}
        gap={px(3)}
        inset={px(12)}
      />
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
  const brandHeight = px(28)
  const brandGap = px(10)
  const tierGap = px(10)
  const tierHeight = px(68)
  const contentHeight =
    innerHeight - brandHeight - brandGap - tierGap - tierHeight
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
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
        fontSize={px(11)}
        gap={brandGap}
      />
      {mode === 'three' ? (
        <ThreeItemLayout
          props={props}
          width={innerWidth}
          height={contentHeight}
        />
      ) : mode === 'compact' ? (
        <FourRowLayout
          props={props}
          width={innerWidth}
          height={contentHeight}
        />
      ) : (
        <FourModuleLayout
          props={props}
          width={innerWidth}
          height={contentHeight}
        />
      )}
      <Rectangle fill={CLEAR} frame={{ width: 1, height: tierGap }} />
      <TierPanel
        detail={tier.detail}
        fraction={tier.fraction}
        width={innerWidth}
        height={tierHeight}
      />
    </VStack>
  )
}
