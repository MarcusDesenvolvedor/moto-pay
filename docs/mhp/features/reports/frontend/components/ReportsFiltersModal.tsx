import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { PeriodPreset } from '../types/reports.types';
import { Company } from '../../../../../../shared/api/companies.api';
import type { VehicleFilterOption } from './ReportsFilterBar';

export interface ReportsFiltersState {
  companyId: string | null;
  period: PeriodPreset;
  vehicleId: string | null;
}

interface ReportsFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ReportsFiltersState) => void;
  companies: Company[];
  vehicles: VehicleFilterOption[];
  initialFilters: ReportsFiltersState;
}

const PERIOD_OPTIONS: { value: PeriodPreset; label: string }[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.chipText, selected && styles.chipTextActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function ReportsFiltersModal({
  visible,
  onClose,
  onApply,
  companies,
  vehicles,
  initialFilters,
}: ReportsFiltersModalProps) {
  const [companyId, setCompanyId] = useState<string | null>(
    initialFilters.companyId,
  );
  const [period, setPeriod] = useState<PeriodPreset>(initialFilters.period);
  const [vehicleId, setVehicleId] = useState<string | null>(
    initialFilters.vehicleId,
  );

  useEffect(() => {
    if (visible) {
      setCompanyId(initialFilters.companyId);
      setPeriod(initialFilters.period);
      setVehicleId(initialFilters.vehicleId);
    }
  }, [
    visible,
    initialFilters.companyId,
    initialFilters.period,
    initialFilters.vehicleId,
  ]);

  const companyVehicles = vehicles;

  const handleApply = () => {
    onApply({ companyId, period, vehicleId: companyId ? vehicleId : null });
    onClose();
  };

  const handleClear = () => {
    setPeriod('month');
    setVehicleId(null);
    if (companies.length > 0) {
      setCompanyId(companies[0].id);
      onApply({
        companyId: companies[0].id,
        period: 'month',
        vehicleId: null,
      });
    }
    onClose();
  };

  const handleCompanyChange = (id: string) => {
    setCompanyId(id);
    setVehicleId(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            Platform.OS === 'ios'
              ? styles.modalContentIos
              : styles.modalContentAndroid,
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <FilterSection title="Company">
              <View style={styles.chipRow}>
                {companies.map((c) => (
                  <FilterChip
                    key={c.id}
                    label={c.name}
                    selected={companyId === c.id}
                    onPress={() => handleCompanyChange(c.id)}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Period">
              <View style={styles.chipRow}>
                {PERIOD_OPTIONS.map((opt) => (
                  <FilterChip
                    key={opt.value}
                    label={opt.label}
                    selected={period === opt.value}
                    onPress={() => setPeriod(opt.value)}
                  />
                ))}
              </View>
            </FilterSection>

            {companyId && companyVehicles.length > 0 && (
              <FilterSection title="Vehicle (category filter)">
                <View style={styles.chipRow}>
                  <FilterChip
                    label="All"
                    selected={!vehicleId}
                    onPress={() => setVehicleId(null)}
                  />
                  {companyVehicles.map((v) => (
                    <FilterChip
                      key={v.id}
                      label={v.name}
                      selected={vehicleId === v.id}
                      onPress={() => setVehicleId(v.id)}
                    />
                  ))}
                </View>
              </FilterSection>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton,
                !companyId && styles.applyButtonDisabled,
              ]}
              onPress={handleApply}
              activeOpacity={0.8}
              disabled={!companyId}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalContentIos: {
    paddingBottom: 34,
  },
  modalContentAndroid: {
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
  },
  clearButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    ...typography.button,
    color: colors.background,
  },
});
