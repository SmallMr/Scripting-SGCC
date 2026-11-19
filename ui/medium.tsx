import {
  HStack,
  Image,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  Widget
} from 'scripting'
import {
  TIER_CAPTIONS,
  pickRecentBars,
  tierPosition
} from '../core/usage'
import { GridMark, StatTile, TierTicks, UsageColumns } from './atoms'
import { CLEAR, INK, INK_MUTED, TILE, clockText, legacyPt } from './theme'
import type { WidgetViewProps } from './model'

export function WideWidgetView({
  summary,
  settings,
  syncedAt,
  warning
}: WidgetViewProps) {
  const columns = pickRecentBars(summary, {
    unit: settings.dimension,
    count: settings.barCount,
    firstCap: settings.oneLevelPq,
    secondCap: settings.twoLevelPq
  })
  const position = tierPosition(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )

  const padding = legacyPt(12)
  const sideInset = legacyPt(4)
  const columnWidth = legacyPt(6)
  const columnGap = legacyPt(6)
  const leftWidth =
    Math.max(settings.barCount, 7) * (columnWidth + columnGap) -
    columnGap +
    sideInset * 2
  const columnBlockGap = legacyPt(12)
  const stepPaddingX = legacyPt(12)
  const rightWidth =
    Widget.displaySize.width - padding * 2 - leftWidth - columnBlockGap

  return (
    <HStack
      alignment="top"
      spacing={columnBlockGap}
      padding={padding}
      frame={{ maxWidth: 'infinity', maxHeight: 'infinity' }}
      widgetBackground={{
        light: {
          stops: [
            { color: 'rgba(0,112,107,0.18)', location: 0 },
            { color: '#FFFFFF', location: 0.35 }
          ],
          startPoint: 'topLeading',
          endPoint: { x: 0.45, y: 1 }
        },
        dark: '#171A18'
      }}
    >
      <VStack
        alignment="leading"
        spacing={0}
        padding={{ horizontal: sideInset, bottom: legacyPt(4) }}
        frame={{
          width: leftWidth,
          maxHeight: 'infinity',
          alignment: 'topLeading'
        }}
        background={
          <RoundedRectangle
            cornerRadius={legacyPt(6)}
            fill={{
              light: {
                stops: [
                  { color: CLEAR, location: 0.4 },
                  { color: TILE.light, location: 1 }
                ],
                startPoint: 'top',
                endPoint: 'bottom'
              },
              dark: {
                stops: [
                  { color: CLEAR, location: 0.4 },
                  { color: TILE.dark, location: 1 }
                ],
                startPoint: 'top',
                endPoint: 'bottom'
              }
            }}
          />
        }
      >
        <GridMark size={legacyPt(24)} />
        <Spacer minLength={legacyPt(12)} />
        <Text font={legacyPt(10)} foregroundStyle={INK_MUTED}>
          {summary.hasArrears ? '待缴电费' : '剩余电费'}
        </Text>
        <Text
          font={legacyPt(18)}
          fontWeight="bold"
          fontDesign="rounded"
          foregroundStyle={INK}
          lineLimit={1}
          minScaleFactor={0.5}
        >
          {summary.balance}
        </Text>
        <Spacer minLength={0} />
        <UsageColumns
          items={columns}
          height={legacyPt(40) - legacyPt(4) * 2}
          columnWidth={columnWidth}
          gap={columnGap}
        />
      </VStack>

      <VStack
        spacing={legacyPt(6)}
        frame={{ maxWidth: 'infinity', maxHeight: 'infinity' }}
      >
        <HStack spacing={legacyPt(8)}>
          <StatTile label="上期电费" value={summary.previousCost} />
          <StatTile label="上期电量" value={summary.previousUsage} />
        </HStack>
        <HStack spacing={legacyPt(8)}>
          <StatTile label="年度电费" value={summary.yearCost} />
          <StatTile label="年度电量" value={summary.yearUsage} />
        </HStack>
        <VStack
          alignment="leading"
          spacing={legacyPt(4)}
          frame={{
            maxWidth: 'infinity',
            maxHeight: 'infinity',
            alignment: 'topLeading'
          }}
          padding={{ vertical: legacyPt(6), horizontal: stepPaddingX }}
          background={<RoundedRectangle cornerRadius={legacyPt(6)} fill={TILE} />}
        >
          <HStack spacing={2}>
            <Text font={legacyPt(8)} foregroundStyle={INK_MUTED} lineLimit={1}>
              {settings.showStepProgress
                ? `第${TIER_CAPTIONS[position.tier]}梯度：${Number(
                    (position.percent * 100).toFixed(2)
                  )}%`
                : `阶梯电量：${summary.tierUsage}`}
            </Text>
            <Spacer />
            <Image
              systemName={
                warning ? 'exclamationmark.triangle' : 'clock.arrow.circlepath'
              }
              font={legacyPt(8)}
              foregroundStyle={warning ? 'systemOrange' : INK_MUTED}
            />
            <Text font={legacyPt(8)} foregroundStyle={INK_MUTED}>
              {clockText(syncedAt)}
            </Text>
          </HStack>
          {settings.showStepProgress ? (
            <TierTicks
              tier={position.tier}
              percent={position.percent}
              width={rightWidth - stepPaddingX * 2}
            />
          ) : null}
        </VStack>
      </VStack>
    </HStack>
  )
}
