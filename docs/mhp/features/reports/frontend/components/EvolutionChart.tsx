import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { AnimatedCard } from '../../../../../../shared/components/animated/AnimatedCard';
import { reportsChartConfig } from './chart-config';
import { ReportsSummaryItem } from '../types/reports.types';

interface EvolutionChartProps {
  data: ReportsSummaryItem[];
}

const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;
const CHART_HEIGHT = 200;
const MAX_POINTS = 10;

export function EvolutionChart({ data }: EvolutionChartProps) {
  if (!data || data.length === 0) {
    return (
      <AnimatedCard style={styles.container}>
        <Text style={styles.title}>Evolução Receitas x Despesas</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum dado no período selecionado</Text>
        </View>
      </AnimatedCard>
    );
  }

  const displayData = data.slice(-MAX_POINTS);
  const labels = displayData.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  const chartData = {
    labels,
    legend: ['Receitas', 'Despesas'],
    data: displayData.map((d) => [d.income, d.expense]),
    barColors: [colors.success, colors.error],
  };

  return (
    <AnimatedCard style={styles.container} delay={50}>
      <Text style={styles.title}>Evolução Receitas x Despesas</Text>
      <StackedBarChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        yAxisLabel="R$ "
        yAxisSuffix=""
        chartConfig={reportsChartConfig}
        style={styles.chart}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Receitas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Despesas</Text>
        </View>
      </View>
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
  chart: {
    borderRadius: 8,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.lg,
    flexWrap: 'wrap',
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
