import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useCompanies } from '../hooks/use-companies';
import { useDeleteCompany } from '../hooks/use-delete-company';
import { Company } from '../types/company.types';
import { Button } from '../../../../../../../shared/components/Button';
import { Loading } from '../../../../../../../shared/components/Loading';
import { ConfirmDeleteModal } from '../../../../../../../shared/components/ConfirmDeleteModal';
import { colors } from '../../../../../../../shared/theme/colors';
import { typography } from '../../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../../shared/theme/spacing';
import { ProfileStackParamList } from '../../../../../../../navigation/ProfileStack';

type CompaniesListScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'CompaniesList'
>;

export function CompaniesListScreen() {
  const navigation = useNavigation<CompaniesListScreenNavigationProp>();
  const { data: companies, isLoading, error, refetch } = useCompanies();
  const deleteCompanyMutation = useDeleteCompany();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const handleAddCompany = () => {
    (navigation as any).navigate('CreateCompany');
  };

  const handleDeletePress = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompanyMutation.mutateAsync(companyToDelete.id);
      setDeleteModalVisible(false);
      setCompanyToDelete(null);
      Alert.alert('Sucesso', 'Empresa deletada com sucesso!');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível deletar a empresa. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setCompanyToDelete(null);
  };

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <View style={styles.companyCard}>
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.companyDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePress(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhuma empresa cadastrada</Text>
      <Text style={styles.emptyText}>
        Adicione sua primeira empresa para começar
      </Text>
      <Button
        title="Adicionar Empresa"
        onPress={handleAddCompany}
        style={styles.emptyButton}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Erro ao carregar empresas</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </Text>
          <Button
            title="Tentar Novamente"
            onPress={() => refetch()}
            variant="outline"
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={companies || []}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          !companies || companies.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {/* Add Company Button */}
      {companies && companies.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddCompany}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        title="Deletar Empresa"
        message="Tem certeza que deseja deletar a empresa"
        itemName={companyToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteCompanyMutation.isPending}
      />
    </View>
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
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + 80, // Space for FAB
  },
  emptyListContainer: {
    flex: 1,
  },
  companyCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.error + '20',
  },
  companyName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  companyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

