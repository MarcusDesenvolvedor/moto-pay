import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useVehicles, Vehicle } from '../hooks/use-vehicles';
import { useDeleteVehicle } from '../hooks/use-delete-vehicle';
import { Loading } from '../../../../../../shared/components/Loading';
import { Button } from '../../../../../../shared/components/Button';
import { ConfirmDeleteModal } from '../../../../../../shared/components/ConfirmDeleteModal';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';
import { ProfileStackParamList } from '../../../../../../navigation/ProfileStack';

type VehiclesListScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'VehiclesList'
>;

export function VehiclesListScreen() {
  const navigation = useNavigation<VehiclesListScreenNavigationProp>();
  const { data: vehicles, isLoading, error, refetch } = useVehicles();
  const deleteVehicleMutation = useDeleteVehicle();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleAddVehicle = () => {
    (navigation as any).navigate('AddVehicle');
  };

  const handleDeletePress = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicleMutation.mutateAsync(vehicleToDelete.id);
      setDeleteModalVisible(false);
      setVehicleToDelete(null);
      Alert.alert('Sucesso', 'Veículo deletado com sucesso!');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível deletar o veículo. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setVehicleToDelete(null);
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        {item.plate && (
          <Text style={styles.vehiclePlate}>Placa: {item.plate}</Text>
        )}
        {item.note && (
          <Text style={styles.vehicleNote} numberOfLines={2}>
            {item.note}
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
      <Ionicons name="car-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
      <Text style={styles.emptyText}>
        Adicione seu primeiro veículo para começar
      </Text>
      <Button
        title="Adicionar Veículo"
        onPress={handleAddVehicle}
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
          <Text style={styles.errorTitle}>Erro ao carregar veículos</Text>
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
        data={vehicles || []}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          !vehicles || vehicles.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {/* Add Vehicle Button */}
      {vehicles && vehicles.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddVehicle}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        title="Deletar Veículo"
        message="Tem certeza que deseja deletar o veículo"
        itemName={vehicleToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteVehicleMutation.isPending}
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
  vehicleCard: {
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
  vehicleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.error + '20',
  },
  vehicleName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  vehiclePlate: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  vehicleNote: {
    ...typography.caption,
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

