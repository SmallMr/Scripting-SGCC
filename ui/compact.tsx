import {
  HStack,
  Rectangle,
  Spacer,
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
import { LINE, WIDGET_BG, px } from './theme'
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
  const gap = px(12)
  const divider = px(1)
  const rowHeight = px(72)
  const halfWidth = (width - divider) / 2
  return (
    <VStack alignment="leading" spacing={0} frame={{ width, height }}>
      <HStack spacing={0} frame={{ width, height: rowHeight }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={halfWidth}
          height={rowHeight}
          labelSize={px(17)}
          valueSize={px(36)}
          unitSize={px(16)}
          gap={px(6)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: divider, height: px(48) }}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={halfWidth}
          height={rowHeight}
          labelSize={px(17)}
          valueSize={px(36)}
          unitSize={px(16)}
          gap={px(6)}
          inset={0}
        />
      </HStack>
      <Rectangle fill={CLEAR} frame={{ width: 1, height: gap }} />
      <Rectangle fill={LINE} frame={{ width, height: divider }} />
      <Rectangle fill={CLEAR} frame={{ width: 1, height: gap }} />
      <MetricTile
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={rowHeight}
        labelSize={px(17)}
        valueSize={px(36)}
        unitSize={px(16)}
        moneySize={px(21)}
        gap={px(6)}
        inset={0}
        divider
      />
      <Spacer minLength={0} />
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
    >
      <DataRow
        label="昨日"
        value={summary.yesterdayUsage}
        width={width}
        height={rowHeight}
        first
        labelWidth={px(36)}
        labelSize={px(16)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        inset={0}
      />
      <DataRow
        label="本月"
        value={summary.monthUsage}
        width={width}
        height={rowHeight}
        labelWidth={px(36)}
        labelSize={px(16)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        inset={0}
      />
      <DataRow
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={rowHeight}
        labelWidth={px(36)}
        labelSize={px(16)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        inset={0}
      />
      <DataRow
        label="本年"
        value={summary.yearUsage}
        money={summary.yearCost}
        width={width}
        height={rowHeight}
        labelWidth={px(36)}
        labelSize={px(16)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        inset={0}
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
  const topHeight = px(60)
  const divider = px(1)
  const ticketHeight = (height - topHeight - divider * 2) / 2
  const halfWidth = (width - divider) / 2
  return (
    <VStack alignment="leading" spacing={0} frame={{ width, height }}>
      <HStack spacing={0} frame={{ width, height: topHeight }}>
        <MetricTile
          label="昨日"
          value={summary.yesterdayUsage}
          width={halfWidth}
          height={topHeight}
          labelSize={px(17)}
          valueSize={px(30)}
          unitSize={px(15)}
          gap={px(2)}
          inset={0}
        />
        <Rectangle
          fill={LINE}
          frame={{ width: divider, height: px(34) }}
        />
        <MetricTile
          label="本月"
          value={summary.monthUsage}
          width={halfWidth}
          height={topHeight}
          labelSize={px(17)}
          valueSize={px(30)}
          unitSize={px(15)}
          gap={px(2)}
          inset={0}
        />
      </HStack>
      <Rectangle fill={LINE} frame={{ width, height: divider }} />
      <MetricTile
        label="上月"
        value={summary.previousUsage}
        money={summary.previousCost}
        width={width}
        height={ticketHeight}
        labelSize={px(17)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        gap={px(2)}
        inset={0}
      />
      <Rectangle fill={LINE} frame={{ width, height: divider }} />
      <MetricTile
        label="本年"
        value={summary.yearUsage}
        money={summary.yearCost}
        width={width}
        height={ticketHeight}
        labelSize={px(17)}
        valueSize={px(30)}
        unitSize={px(15)}
        moneySize={px(19)}
        gap={px(2)}
        inset={0}
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
  const brandGap = px(6)
  const tierGap = px(8)
  const tierHeight = px(56)
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
        fontSize={px(17)}
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
