import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { AnimatedCard } from '../../../../../../shared/components/animated/AnimatedCard';
import { reportsChartConfig } from './chart-config';
import { ReportsByVehicleItem } from '../types/reports.types';

interface VehicleChartProps {
  data: ReportsByVehicleItem[];
}

const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2;
const CHART_HEIGHT = 180;

export function VehicleChart({ data }: VehicleChartProps) {
  if (!data || data.length === 0) {
    return (
      <AnimatedCard style={styles.container} delay={150}>
        <Text style={styles.title}>By Vehicle</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data for the selected period</Text>
        </View>
      </AnimatedCard>
    );
  }

  const displayData = data.slice(0, 8);
  const labels = displayData.map((d) =>
    d.vehicleName.length > 10 ? `${d.vehicleName.slice(0, 8)}...` : d.vehicleName,
  );
  const profitData = displayData.map((d) => Math.max(0, d.profit));

  const chartData = {
    labels,
    datasets: [{ data: profitData }],
  };

  return (
    <AnimatedCard style={styles.container} delay={150}>
      <Text style={styles.title}>Profit by Vehicle</Text>
      <BarChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        yAxisLabel="R$ "
        yAxisSuffix=""
        chartConfig={reportsChartConfig}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
        withInnerLines
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
});
