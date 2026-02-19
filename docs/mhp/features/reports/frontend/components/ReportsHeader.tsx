import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { ProfileAvatarView } from '../../../profile/frontend/components/ProfileAvatarView';

interface ReportsHeaderProps {
  avatarUri?: string | null;
  firstName: string;
  onNotificationsPress?: () => void;
}

/**
 * Reusable header for the Reports screen.
 * Displays user avatar, welcome message, and notifications icon.
 */
export function ReportsHeader({
  avatarUri,
  firstName,
  onNotificationsPress,
}: ReportsHeaderProps) {
  return (
    <View style={styles.container}>
      <ProfileAvatarView imageUri={avatarUri} size={44} />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {firstName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onNotificationsPress}
        style={styles.notificationButton}
        activeOpacity={0.7}
        accessibilityLabel="Notifications"
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  nameText: {
    ...typography.h2,
    color: colors.text,
  },
  notificationButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
});
