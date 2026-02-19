import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../../profile/frontend/hooks/use-profile';
import { useLogout } from '../../../profile/frontend/hooks/use-logout';
import { useSessions, useLogoutSession, useLogoutAllSessions } from '../hooks/use-sessions';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { ConfirmDeleteModal } from '../../../../../../shared/components/ConfirmDeleteModal';
import { Loading } from '../../../../../../shared/components/Loading';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { ProfileStackParamList } from '../../../../../../navigation/ProfileStack';
import { ScreenHeader } from '../../../../../../shared/components/ScreenHeader';

type SecurityScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Security'
>;

export function SecurityScreen() {
  const navigation = useNavigation<SecurityScreenNavigationProp>();
  const { data: user, isLoading: isLoadingUser } = useProfile();
  const { data: sessions, isLoading: isLoadingSessions, refetch } = useSessions();
  const logoutMutation = useLogout();
  const logoutSessionMutation = useLogoutSession();
  const logoutAllSessionsMutation = useLogoutAllSessions();
  
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [logoutAllModalVisible, setLogoutAllModalVisible] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessionToLogout(sessionId);
    Alert.alert(
      'Logout Session',
      'Are you sure you want to logout from this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutSessionMutation.mutateAsync(sessionId);
              Alert.alert('Success', 'Session ended successfully!');
              refetch();
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Could not end session. Please try again.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ],
    );
  };

  const handleLogoutAllSessions = () => {
    setLogoutAllModalVisible(true);
  };

  const confirmLogoutAll = async () => {
    try {
      await logoutAllSessionsMutation.mutateAsync();
      setLogoutAllModalVisible(false);
      Alert.alert(
        'Success',
        'All sessions have been ended. You will need to sign in again.',
      );
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not end sessions. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
              // Navigation will be handled by logout hook
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Could not logout. Please try again.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ],
    );
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Security" showBackButton />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingSessions}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
    >
      {/* Password Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔑 Password</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleChangePassword}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Sessions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📱 Active Sessions</Text>
          {sessions && sessions.length > 0 && (
            <TouchableOpacity
              onPress={handleLogoutAllSessions}
              style={styles.logoutAllButton}
            >
              <Text style={styles.logoutAllText}>Logout from all</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoadingSessions ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : !sessions || sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No active sessions</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionInfo}>
                <View style={styles.sessionHeader}>
                  <Ionicons
                    name={session.platform === 'mobile' ? 'phone-portrait' : 'desktop'}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.sessionPlatform}>
                    {session.platform === 'mobile' ? 'Mobile' : 'Web'}
                    {session.isCurrent && (
                      <Text style={styles.currentBadge}> (Current)</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.sessionDate}>
                  Last activity: {formatDate(session.lastActivity)}
                </Text>
              </View>
              {!session.isCurrent && (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => handleLogoutSession(session.id)}
                  disabled={logoutSessionMutation.isPending}
                >
                  <Ionicons name="log-out-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      {/* Account Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📧 Account Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
          <Text style={styles.infoNotice}>
            Your email is used for account recovery.
          </Text>
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={logoutMutation.isPending}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />

      <ConfirmDeleteModal
        visible={logoutAllModalVisible}
        title="Logout from All Sessions"
        message="Are you sure you want to logout from all sessions? You will need to sign in again on all devices."
        onConfirm={confirmLogoutAll}
        onCancel={() => setLogoutAllModalVisible(false)}
        isLoading={logoutAllSessionsMutation.isPending}
      />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  logoutAllButton: {
    padding: spacing.sm,
  },
  logoutAllText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  sessionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sessionPlatform: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  currentBadge: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  sessionDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  logoutButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.error + '20',
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoNotice: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  logoutCard: {
    backgroundColor: colors.error + '20',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
});


