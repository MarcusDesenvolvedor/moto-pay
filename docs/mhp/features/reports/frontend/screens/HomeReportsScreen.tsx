import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { Loading } from '../../../../../../shared/components/Loading';
import { useCompanies } from '../../../../../../shared/hooks/use-companies';
import { useVehicles } from '../../../vehicles/frontend/hooks/use-vehicles';
import { useProfile } from '../../../profile/frontend/hooks/use-profile';
import { useAvatar } from '../../../profile/frontend/hooks/use-avatar';
import {
  useReportsSummaryByPeriod,
  useReportsByCategory,
  useReportsByVehicle,
} from '../hooks';
import { ReportsHeader } from '../components/ReportsHeader';
import { DailySummaryCard } from '../components/DailySummaryCard';
import { EvolutionChart } from '../components/EvolutionChart';
import { CategoryChart } from '../components/CategoryChart';
import { VehicleChart } from '../components/VehicleChart';
import {
  ReportsFiltersModal,
  ReportsFiltersState,
  VehicleFilterOption,
} from '../components/ReportsFiltersModal';
import { PeriodPreset } from '../types/reports.types';
import { getPeriodRange } from '../utils/period-utils';

function getFirstName(fullName?: string | null, email?: string | null): string {
  if (fullName?.trim()) {
    const first = fullName.trim().split(/\s+/)[0];
    if (first) return first;
  }
  if (email) {
    const localPart = email.split('@')[0];
    if (localPart) return localPart;
  }
  return 'User';
}

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
  const { data: user } = useProfile();
  const { avatarUri } = useAvatar();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodPreset>('month');
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);

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

  const handleFiltersApply = (filters: ReportsFiltersState) => {
    setCompanyId(filters.companyId);
    setPeriod(filters.period);
    setVehicleId(filters.vehicleId);
    setFiltersModalVisible(false);
  };

  const handleNotificationsPress = () => {
    Alert.alert(
      'Coming soon',
      'Notifications will be available in a future update.',
      [{ text: 'OK' }],
    );
  };

  const vehicleOptions: VehicleFilterOption[] = vehicles.map((v) => ({
    id: v.id,
    name: v.name,
  }));

  const currentFilters: ReportsFiltersState = {
    companyId,
    period,
    vehicleId,
  };

  const firstName = getFirstName(user?.fullName, user?.email);

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
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <ReportsHeader
          avatarUri={avatarUri}
          firstName={firstName}
          onNotificationsPress={handleNotificationsPress}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <TouchableOpacity
          style={styles.filtersButton}
          onPress={() => setFiltersModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.filtersButtonText}>Filters</Text>
        </TouchableOpacity>

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

      <ReportsFiltersModal
        visible={filtersModalVisible}
        onClose={() => setFiltersModalVisible(false)}
        onApply={handleFiltersApply}
        companies={companies}
        vehicles={vehicleOptions}
        initialFilters={currentFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fixedHeader: {
    paddingTop: spacing.xl + spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  filtersButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtersButtonText: {
    ...typography.label,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
