import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

export type DailySummaryCardType = 'income' | 'expense';

interface DailySummaryCardProps {
  type: DailySummaryCardType;
  value: number;
  label: string;
}

export function DailySummaryCard({
  type,
  value,
  label,
}: DailySummaryCardProps) {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const cardColor = type === 'income' ? colors.success : colors.error;

  return (
    <View style={[styles.container, { borderLeftColor: cardColor }]}>
      <Text style={[styles.value, { color: cardColor }]}>
        {formattedValue}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginHorizontal: spacing.xs,
  },
  value: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

