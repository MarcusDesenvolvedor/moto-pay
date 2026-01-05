import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../../../../navigation/ProfileStack';
import { useProfile } from '../hooks/use-profile';
import { useLogout } from '../hooks/use-logout';
import { useAvatar } from '../hooks/use-avatar';
import { ProfileAvatarView } from '../components/ProfileAvatarView';
import { ProfileItem } from '../components/ProfileItem';
import { Loading } from '../../../../../../shared/components/Loading';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'ProfileMain'
>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { data: user, isLoading } = useProfile();
  const logoutMutation = useLogout();
  const { avatarUri, isLoading: isLoadingAvatar, refetch: refetchAvatar } = useAvatar();

  // Refetch avatar when screen comes into focus (e.g., returning from EditProfile)
  useFocusEffect(
    React.useCallback(() => {
      refetchAvatar();
    }, [refetchAvatar])
  );

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
              // Navigation will be handled by App.tsx based on isAuthenticated state
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          },
        },
      ],
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleMyCompanies = () => {
    navigation.navigate('CompaniesList');
  };

  const handleMyVehicles = () => {
    navigation.navigate('VehiclesList');
  };

  const handleSecurity = () => {
    (navigation as any).navigate('Security');
  };

  const handleTerms = () => {
    // TODO: Navigate to terms screen
    Alert.alert('Em breve', 'Termos e privacidade em desenvolvimento.');
  };

  if (isLoading || isLoadingAvatar) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Erro ao carregar perfil</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <ProfileAvatarView
          imageUri={avatarUri}
          size={120}
        />
        <Text style={styles.userName}>{user.fullName || user.email}</Text>
        <Text style={styles.subtitle}>MotoPay User</Text>
      </View>

      {/* Profile Data */}
      <View style={styles.dataSection}>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Email</Text>
          <Text style={styles.dataValue}>{user.email}</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Membro desde</Text>
          <Text style={styles.dataValue}>{formatDate(user.createdAt)}</Text>
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsSection}>
        <ProfileItem
          icon="person-outline"
          label="Editar Perfil"
          onPress={handleEditProfile}
        />
        <ProfileItem
          icon="business-outline"
          label="Minhas Empresas"
          onPress={handleMyCompanies}
        />
        <ProfileItem
          icon="car-outline"
          label="Meus Veículos"
          onPress={handleMyVehicles}
        />
        <ProfileItem
          icon="lock-closed-outline"
          label="Segurança"
          onPress={handleSecurity}
        />
        <ProfileItem
          icon="document-text-outline"
          label="Termos e Privacidade"
          onPress={handleTerms}
        />
        <View style={styles.divider} />
        <ProfileItem
          icon="log-out-outline"
          label="Sair"
          onPress={handleLogout}
          variant="danger"
          showChevron={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  dataSection: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    padding: spacing.lg,
  },
  dataItem: {
    marginBottom: spacing.md,
  },
  dataLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dataValue: {
    ...typography.body,
    color: colors.text,
  },
  optionsSection: {
    marginHorizontal: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
});

