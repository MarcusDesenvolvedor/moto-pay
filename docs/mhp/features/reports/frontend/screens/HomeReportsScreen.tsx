import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { Loading } from '../../../../../../shared/components/Loading';
import { useCompanies } from '../../../../../../shared/hooks/use-companies';
import { useVehicles } from '../../../vehicles/frontend/hooks/use-vehicles';
import {
  useReportsSummaryByPeriod,
  useReportsByCategory,
  useReportsByVehicle,
} from '../hooks';
import { DailySummaryCard } from '../components/DailySummaryCard';
import { EvolutionChart } from '../components/EvolutionChart';
import { CategoryChart } from '../components/CategoryChart';
import { VehicleChart } from '../components/VehicleChart';
import { ReportsFilterBar } from '../components/ReportsFilterBar';
import { PeriodPreset } from '../types/reports.types';
import { getPeriodRange } from '../utils/period-utils';

function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function HomeReportsScreen() {
  const queryClient = useQueryClient();
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompanies();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodPreset>('month');
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  useEffect(() => {
    if (companies.length > 0 && !companyId) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  const { startDate, endDate } = getPeriodRange(period);
  const todayStr = getTodayLocalDate();

  const {
    data: summaryByPeriod,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    refetch: refetchSummary,
  } = useReportsSummaryByPeriod({
    companyId,
    startDate,
    endDate,
  });

  // Dados de hoje: usa o mesmo endpoint dos charts (summary) com data atual
  const {
    data: todaySummary,
    isLoading: isLoadingToday,
    refetch: refetchToday,
  } = useReportsSummaryByPeriod({
    companyId,
    startDate: todayStr,
    endDate: todayStr,
  });

  const todayData = todaySummary?.[0];
  const todayIncome = todayData?.income ?? 0;
  const todayExpense = todayData?.expense ?? 0;
  const todayProfit = todayIncome - todayExpense;

  const {
    data: byCategory,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    refetch: refetchCategory,
  } = useReportsByCategory({
    companyId,
    startDate,
    endDate,
    vehicleId: vehicleId ?? undefined,
  });

  const {
    data: byVehicle,
    isLoading: isLoadingVehicle,
    isError: isErrorVehicle,
    refetch: refetchVehicle,
  } = useReportsByVehicle({
    companyId,
    startDate,
    endDate,
  });

  const isLoading =
    isLoadingCompanies ||
    isLoadingVehicles ||
    isLoadingToday ||
    isLoadingSummary ||
    isLoadingCategory ||
    isLoadingVehicle;

  const hasError =
    isErrorSummary || isErrorCategory || isErrorVehicle;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    refetchToday();
    refetchSummary();
    refetchCategory();
    refetchVehicle();
  };

  if (isLoadingCompanies && companies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (companies.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No companies</Text>
        <Text style={styles.emptyText}>
          Create or join a company to see reports.
        </Text>
      </View>
    );
  }

  if (!companyId) {
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
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSubtitle}>
          Income, expenses and profit by period
        </Text>
      </View>

      <ReportsFilterBar
        companies={companies}
        companyId={companyId}
        onCompanyChange={setCompanyId}
        period={period}
        onPeriodChange={setPeriod}
        vehicles={vehicles}
        vehicleId={vehicleId}
        onVehicleChange={setVehicleId}
      />

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Could not load data.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRefresh}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!hasError && (
        <>
          <View style={styles.todaySection}>
            <Text style={styles.todaySectionTitle}>Today</Text>
            <View style={styles.summaryContainer}>
              <DailySummaryCard
                type="income"
                value={todayIncome}
                label="Income"
              />
              <DailySummaryCard
                type="expense"
                value={todayExpense}
                label="Expenses"
              />
            </View>
            <View style={styles.profitCard}>
              <Text style={styles.profitLabel}>Profit today</Text>
              <Text
                style={[
                  styles.profitValue,
                  todayProfit >= 0 ? styles.profitPositive : styles.profitNegative,
                ]}
              >
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(todayProfit)}
              </Text>
            </View>
          </View>

          <EvolutionChart data={summaryByPeriod ?? []} />
          <CategoryChart data={byCategory ?? []} />
          <VehicleChart data={byVehicle ?? []} />
        </>
      )}
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
  todaySection: {
    marginBottom: spacing.lg,
  },
  todaySectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  profitCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  profitLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  profitValue: {
    ...typography.h3,
    color: colors.text,
  },
  profitPositive: {
    color: colors.success,
  },
  profitNegative: {
    color: colors.error,
  },
  errorContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
