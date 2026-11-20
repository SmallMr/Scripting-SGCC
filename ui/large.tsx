import { HStack, Spacer, Text, VStack } from 'scripting'
import { calendarForMonth, tierDisplay } from '../core/usage'
import {
  BrandHeader,
  CalendarCellView,
  Gap,
  GridModule,
  LegendItem,
  ThemeShell,
  TierChip,
  TierLine,
  UsageValue,
  ValueChip,
  contentHeight,
  contentWidth
} from './atoms'
import {
  AMBER,
  BLUE,
  INK,
  RED,
  formatUsage,
  pt,
  themePalette
} from './theme'
import type { WidgetViewProps } from './model'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export function LargeWidgetView({
  summary,
  settings,
  syncedAt
}: WidgetViewProps) {
  const theme = settings.theme ?? 'island'
  const palette = themePalette(theme)
  const width = contentWidth(theme)
  const tier = tierDisplay(
    summary.tierUsage,
    settings.oneLevelPq,
    settings.twoLevelPq
  )
  const calendar = calendarForMonth(summary.days)
  const cellWidth = width / 7
  const rowHeight = pt(27)
  const chipHeight = pt(46)
  const chipGap = pt(6)
  const chipWidth = (width - chipGap * 2) / 3
  const stripWidth = (width - pt(18)) / 4

  return (
    <ThemeShell theme={theme}>
      <BrandHeader theme={theme} syncedAt={syncedAt} />
      <Gap height={theme === 'island' ? 4 : 6} />

      {theme === 'island' ? (
        <HStack
          alignment="bottom"
          spacing={0}
          frame={{ width, height: pt(59) }}
        >
          <VStack alignment="leading" spacing={0}>
            <Text
              font={pt(9)}
              fontWeight="semibold"
              foregroundStyle={palette.label}
              lineLimit={1}
            >
              本月
            </Text>
            <UsageValue
              value={formatUsage(summary.monthUsage)}
              size={40}
              unitSize={11}
              color={INK}
              unitColor={palette.label}
            />
          </VStack>
          <Spacer minLength={0} />
          <VStack alignment="trailing" spacing={0}>
            <Text
              font={pt(8.5)}
              fontWeight="semibold"
              foregroundStyle={palette.label}
              lineLimit={1}
            >
              昨日
            </Text>
            <UsageValue
              value={formatUsage(summary.yesterdayUsage)}
              size={20}
              unitSize={8.5}
              color={INK}
              unitColor={palette.label}
              weight="semibold"
            />
          </VStack>
        </HStack>
      ) : (
        <HStack spacing={pt(6)} frame={{ width, height: pt(60) }}>
          <GridModule
            theme={theme}
            width={stripWidth}
            height={pt(60)}
            label="本月"
            value={summary.monthUsage}
            paddingX={6}
          />
          <GridModule
            theme={theme}
            width={stripWidth}
            height={pt(60)}
            label="昨日"
            value={summary.yesterdayUsage}
            paddingX={6}
          />
          <GridModule
            theme={theme}
            width={stripWidth}
            height={pt(60)}
            label="上月"
            value={summary.previousUsage}
            money={summary.previousCost}
            moneySize={7.5}
            paddingX={6}
          />
          <GridModule
            theme={theme}
            width={stripWidth}
            height={pt(60)}
            label="本年"
            value={summary.yearUsage}
            money={summary.yearCost}
            moneySize={7.5}
            paddingX={6}
          />
        </HStack>
      )}

      <Gap height={theme === 'island' ? 6 : 10} />
      <HStack
        alignment="center"
        spacing={pt(7)}
        frame={{ width, height: pt(14) }}
      >
        <Text
          font={pt(9)}
          fontWeight="semibold"
          foregroundStyle={palette.title}
          lineLimit={1}
        >
          本月每日用电
        </Text>
        <Spacer minLength={0} />
        <LegendItem theme={theme} color={RED} text="最高" />
        <LegendItem theme={theme} color={BLUE} text="最低" />
        <LegendItem theme={theme} color={AMBER} text="今天" />
      </HStack>
      <Gap height={theme === 'island' ? 2 : 3} />

      <HStack
        spacing={0}
        frame={{ width, height: pt(theme === 'island' ? 13 : 12) }}
      >
        {WEEKDAYS.map((name) => (
          <Text
            key={name}
            font={pt(theme === 'island' ? 8 : 7.5)}
            fontWeight="medium"
            foregroundStyle={palette.faint}
            lineLimit={1}
            frame={{ width: cellWidth, alignment: 'center' }}
          >
            {name}
          </Text>
        ))}
      </HStack>

      <VStack alignment="leading" spacing={0} frame={{ width }}>
        {Array.from({ length: 6 }, (_, row) => (
          <HStack key={row} spacing={0} frame={{ width, height: rowHeight }}>
            {calendar.cells.slice(row * 7, row * 7 + 7).map((cell) => (
              <CalendarCellView
                cell={cell}
                width={cellWidth}
                height={rowHeight}
                dateSize={theme === 'island' ? 7.5 : 8}
                valueSize={12}
              />
            ))}
          </HStack>
        ))}
      </VStack>

      <Spacer minLength={0} />

      {theme === 'island' ? (
        <HStack spacing={chipGap} frame={{ width, height: chipHeight }}>
          <ValueChip
            theme={theme}
            width={chipWidth}
            height={chipHeight}
            label="上月"
            value={summary.previousUsage}
            money={summary.previousCost}
          />
          <ValueChip
            theme={theme}
            width={chipWidth}
            height={chipHeight}
            label="本年"
            value={summary.yearUsage}
            money={summary.yearCost}
          />
          <TierChip
            theme={theme}
            tier={tier}
            width={chipWidth}
            height={chipHeight}
          />
        </HStack>
      ) : (
        <TierLine theme={theme} tier={tier} height={24} />
      )}
    </ThemeShell>
  )
}
