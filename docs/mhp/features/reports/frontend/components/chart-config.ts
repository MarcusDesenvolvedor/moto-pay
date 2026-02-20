import { colors } from '../../../../../../shared/theme/colors';
import { spacing } from '../../../../../../shared/theme/spacing';

/** Abbreviates large numbers to keep chart labels readable (1.5k, 2.3M) */
export function formatChartValue(value: number): string {
  const num = Number(value);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toFixed(0);
}

export function getReportsChartConfig(showValues: boolean) {
  return {
    backgroundColor: colors.backgroundSecondary,
    backgroundGradientFrom: colors.backgroundSecondary,
    backgroundGradientTo: colors.backgroundSecondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
    labelColor: () => colors.textSecondary,
    formatYLabel: (value: string) =>
      showValues ? formatChartValue(Number(value)) : '',
    style: {
      borderRadius: 8,
      padding: spacing.sm,
    },
    barPercentage: 0.6,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeWidth: 0.5,
    },
  };
}

/** @deprecated Use getReportsChartConfig(showValues) for tap-to-show behavior */
export const reportsChartConfig = getReportsChartConfig(true);
