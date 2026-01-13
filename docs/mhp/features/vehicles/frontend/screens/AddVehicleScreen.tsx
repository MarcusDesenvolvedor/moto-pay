import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../../../../shared/components/Input';
import { Button } from '../../../../../../shared/components/Button';
import { Loading } from '../../../../../../shared/components/Loading';
import { useCreateVehicle } from '../hooks/use-create-vehicle';
import { CreateVehicleRequest } from '../types/vehicle.types';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

const vehicleSchema = z.object({
  name: z.string().min(1, 'Nome do veículo é obrigatório'),
  plate: z.string().optional(),
  note: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export function AddVehicleScreen() {
  const createVehicleMutation = useCreateVehicle();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: '',
      plate: '',
      note: '',
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const vehicleData: CreateVehicleRequest = {
        name: data.name.trim(),
        plate: data.plate?.trim() || undefined,
        note: data.note?.trim() || undefined,
      };

      await createVehicleMutation.mutateAsync(vehicleData);

      // Reset form after success
      reset();

      Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
    } catch (error: unknown) {
      let errorMessage = 'Erro ao cadastrar veículo. Tente novamente.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Cadastrar Veículo</Text>

          {/* Vehicle Name Input */}
          <View style={styles.section}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do Veículo *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: Moto Principal, CG 160, XRE 300"
                  error={errors.name?.message}
                />
              )}
            />
          </View>

          {/* License Plate Input */}
          <View style={styles.section}>
            <Controller
              control={control}
              name="plate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Placa (opcional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="ABC-1234"
                  error={errors.plate?.message}
                />
              )}
            />
          </View>

          {/* Observation/Note Input */}
          <View style={styles.section}>
            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Observação (opcional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Adicione uma observação..."
                  multiline
                  numberOfLines={3}
                  style={styles.noteInput}
                  error={errors.note?.message}
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Salvar Veículo"
            onPress={handleSubmit(onSubmit)}
            loading={createVehicleMutation.isPending}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});






