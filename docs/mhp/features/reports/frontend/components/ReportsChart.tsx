import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
}

interface ReportsChartProps {
  data: ChartDataPoint[];
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;
const BAR_WIDTH = 40;
const BAR_SPACING = 8;
const MAX_BARS = 7;

export function ReportsChart({ data }: ReportsChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const displayData = data.slice(-MAX_BARS);
  const maxValue = Math.max(
    ...displayData.flatMap((d) => [d.income, d.expense]),
    100,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Income vs Expenses</Text>
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {displayData.map((point, index) => {
            const incomeHeight = (point.income / maxValue) * CHART_HEIGHT;
            const expenseHeight = (point.expense / maxValue) * CHART_HEIGHT;

            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barsColumn}>
                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      { height: Math.max(incomeHeight, 2) },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      { height: Math.max(expenseHeight, 2) },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{formatDate(point.date)}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartContainer: {
    height: CHART_HEIGHT + spacing.lg,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsColumn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: spacing.xs,
  },
  bar: {
    width: BAR_WIDTH / 2 - 2,
    borderRadius: 2,
    minHeight: 2,
  },
  incomeBar: {
    backgroundColor: colors.success,
  },
  expenseBar: {
    backgroundColor: colors.error,
  },
  barLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

