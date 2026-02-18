import { colors } from '../../../../../../shared/theme/colors';
import { spacing } from '../../../../../../shared/theme/spacing';

export const reportsChartConfig = {
  backgroundColor: colors.backgroundSecondary,
  backgroundGradientFrom: colors.backgroundSecondary,
  backgroundGradientTo: colors.backgroundSecondary,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
  labelColor: () => colors.textSecondary,
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
