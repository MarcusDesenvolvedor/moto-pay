import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

interface ProfileItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  variant?: 'default' | 'danger';
}

export function ProfileItem({
  icon,
  label,
  onPress,
  showChevron = true,
  variant = 'default',
}: ProfileItemProps) {
  const textColor = variant === 'danger' ? colors.error : colors.text;
  const iconColor = variant === 'danger' ? colors.error : colors.primary;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.primary}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 8,
    minHeight: 56,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
});

