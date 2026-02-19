import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { PeriodPreset } from '../types/reports.types';
import { Company } from '../../../../../../shared/api/companies.api';

export interface VehicleFilterOption {
  id: string;
  name: string;
}

interface ReportsFilterBarProps {
  companies: Company[];
  companyId: string | null;
  onCompanyChange: (id: string) => void;
  period: PeriodPreset;
  onPeriodChange: (p: PeriodPreset) => void;
  vehicles: VehicleFilterOption[];
  vehicleId: string | null;
  onVehicleChange: (id: string | null) => void;
}

const PERIOD_OPTIONS: { value: PeriodPreset; label: string }[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function ReportsFilterBar({
  companies,
  companyId,
  onCompanyChange,
  period,
  onPeriodChange,
  vehicles,
  vehicleId,
  onVehicleChange,
}: ReportsFilterBarProps) {
  const selectedCompany = companies.find((c) => c.id === companyId);
  const companyVehicles = vehicles;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Company</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {companies.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.chip,
                companyId === c.id && styles.chipActive,
              ]}
              onPress={() => onCompanyChange(c.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  companyId === c.id && styles.chipTextActive,
                ]}
                numberOfLines={1}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Period</Text>
        <View style={styles.chipRow}>
          {PERIOD_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, period === opt.value && styles.chipActive]}
              onPress={() => onPeriodChange(opt.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  period === opt.value && styles.chipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {companyId && companyVehicles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Vehicle (category filter)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <TouchableOpacity
              style={[styles.chip, !vehicleId && styles.chipActive]}
              onPress={() => onVehicleChange(null)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  !vehicleId && styles.chipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {companyVehicles.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[styles.chip, vehicleId === v.id && styles.chipActive]}
                onPress={() => onVehicleChange(v.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    vehicleId === v.id && styles.chipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {v.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
});
