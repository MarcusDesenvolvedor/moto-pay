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
      'Sair da Sessão',
      'Tem certeza que deseja sair desta sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutSessionMutation.mutateAsync(sessionId);
              Alert.alert('Sucesso', 'Sessão encerrada com sucesso!');
              refetch();
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Não foi possível encerrar a sessão. Tente novamente.';
              Alert.alert('Erro', errorMessage);
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
        'Sucesso',
        'Todas as sessões foram encerradas. Você precisará fazer login novamente.',
      );
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível encerrar as sessões. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
              // Navigation will be handled by logout hook
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Não foi possível sair. Tente novamente.';
              Alert.alert('Erro', errorMessage);
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
    <ScrollView
      style={styles.container}
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
        <Text style={styles.sectionTitle}>🔑 Senha</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleChangePassword}
          activeOpacity={0.7}
        >
          <View style={styles.actionContent}>
            <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Alterar Senha</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Sessions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📱 Sessões Ativas</Text>
          {sessions && sessions.length > 0 && (
            <TouchableOpacity
              onPress={handleLogoutAllSessions}
              style={styles.logoutAllButton}
            >
              <Text style={styles.logoutAllText}>Sair de todas</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoadingSessions ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando sessões...</Text>
          </View>
        ) : !sessions || sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Nenhuma sessão ativa</Text>
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
                      <Text style={styles.currentBadge}> (Atual)</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.sessionDate}>
                  Última atividade: {formatDate(session.lastActivity)}
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
        <Text style={styles.sectionTitle}>📧 Informações da Conta</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
          <Text style={styles.infoNotice}>
            Seu email é usado para recuperação de conta.
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
            {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
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
        title="Sair de Todas as Sessões"
        message="Tem certeza que deseja sair de todas as sessões? Você precisará fazer login novamente em todos os dispositivos."
        onConfirm={confirmLogoutAll}
        onCancel={() => setLogoutAllModalVisible(false)}
        isLoading={logoutAllSessionsMutation.isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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


