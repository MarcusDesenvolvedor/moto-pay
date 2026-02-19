import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { AnimatedCard } from '../../../../../../shared/components/animated/AnimatedCard';
import { reportsChartConfig } from './chart-config';
import { ReportsByCategoryItem } from '../types/reports.types';

interface CategoryChartProps {
  data: ReportsByCategoryItem[];
}

const CHART_SIZE = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;
const PIE_COLORS = [
  colors.success,
  colors.error,
  colors.primary,
  colors.purple,
  '#3B82F6',
  '#EC4899',
];

export function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <AnimatedCard style={styles.container} delay={100}>
        <Text style={styles.title}>By Category</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data for the selected period</Text>
        </View>
      </AnimatedCard>
    );
  }

  const chartData = data.slice(0, 8).map((d, i) => ({
    name: d.category.length > 15 ? `${d.category.slice(0, 12)}...` : d.category,
    total: d.total,
    color: PIE_COLORS[i % PIE_COLORS.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  return (
    <AnimatedCard style={styles.container} delay={100}>
      <Text style={styles.title}>By Category</Text>
      <PieChart
        data={chartData}
        width={CHART_SIZE}
        height={180}
        chartConfig={reportsChartConfig}
        accessor="total"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend
      />
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
