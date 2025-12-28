import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { DailySummaryCard } from '../components/DailySummaryCard';
import { ReportsChart } from '../components/ReportsChart';
import { reportsApi } from '../services/reports.api';
import { Loading } from '../../../../../../shared/components/Loading';

export function HomeReportsScreen() {
  const {
    data: dailySummary,
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ['reports', 'daily-summary'],
    queryFn: async () => {
      const response = await reportsApi.getDailySummary();
      return response.data;
    },
  });

  const {
    data: reportsSummary,
    isLoading: isLoadingReports,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: async () => {
      const response = await reportsApi.getReportsSummary();
      return response.data.data;
    },
  });

  const isLoading = isLoadingDaily || isLoadingReports;

  const handleRefresh = () => {
    refetchDaily();
    refetchReports();
  };

  if (isLoading && !dailySummary) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Resumo do dia</Text>
      </View>

      <View style={styles.summaryContainer}>
        <DailySummaryCard
          type="income"
          value={dailySummary?.income || 0}
          label="Ganhos hoje"
        />
        <DailySummaryCard
          type="expense"
          value={dailySummary?.expense || 0}
          label="Gastos hoje"
        />
      </View>

      <ReportsChart data={reportsSummary || []} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
});

