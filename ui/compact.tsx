import { HStack, RoundedRectangle, Spacer, Text, VStack, Widget } from 'scripting'
import { pickRecentBars, tierPosition } from '../core/usage'
import { GridMark, TierRibbon, UsageColumns } from './atoms'
import { CLEAR, INK, INK_MUTED, TILE, legacyPt } from './theme'
import type { WidgetViewProps } from './model'

export function CompactWidgetView({ summary, settings }: WidgetViewProps) {
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

  return (
    <VStack
      alignment="leading"
      spacing={0}
      padding={12}
      frame={{ maxWidth: 'infinity', maxHeight: 'infinity' }}
      widgetBackground={{
        light: {
          stops: [
            { color: '#FFFFFF', location: 0.65 },
            { color: 'rgba(0,112,107,0.18)', location: 1 }
          ],
          startPoint: 'topLeading',
          endPoint: 'bottomTrailing'
        },
        dark: '#171A18'
      }}
    >
      <VStack
        spacing={0}
        clipShape={{ type: 'rect', cornerRadius: 6 }}
        background={
          <RoundedRectangle
            cornerRadius={6}
            fill={{
              light: {
                colors: [CLEAR, TILE.light],
                startPoint: 'top',
                endPoint: 'bottom'
              },
              dark: {
                colors: [CLEAR, TILE.dark],
                startPoint: 'top',
                endPoint: 'bottom'
              }
            }}
          />
        }
      >
        <UsageColumns
          items={columns}
          height={legacyPt(68) - legacyPt(10) * 2}
          columnWidth={legacyPt(8)}
          inset={{ vertical: legacyPt(10), horizontal: legacyPt(8) }}
        />
        {settings.showStepProgress ? (
          <TierRibbon
            tier={position.tier}
            percent={position.percent}
            width={Widget.displaySize.width - 24}
          />
        ) : null}
      </VStack>
      <Spacer minLength={legacyPt(4)} />
      <VStack
        alignment="leading"
        spacing={legacyPt(6)}
        padding={{ bottom: legacyPt(2) }}
      >
        <Text font={legacyPt(12)} foregroundStyle={INK_MUTED} lineLimit={1}>
          {`余额${
            Number(summary.previousCost)
              ? `(上期:${summary.previousCost})`
              : ''
          }`}
        </Text>
        <HStack>
          <Text
            font={legacyPt(24)}
            fontWeight="bold"
            fontDesign="rounded"
            foregroundStyle={INK}
            lineLimit={1}
            minScaleFactor={0.5}
          >
            {summary.balance}
          </Text>
          <Spacer />
          <GridMark size={legacyPt(24)} />
        </HStack>
      </VStack>
    </VStack>
  )
}
