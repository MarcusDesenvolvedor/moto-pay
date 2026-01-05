import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCompany } from '../hooks/use-create-company';
import { Input } from '../../../../../../../shared/components/Input';
import { Button } from '../../../../../../../shared/components/Button';
import { Loading } from '../../../../../../../shared/components/Loading';
import { colors } from '../../../../../../../shared/theme/colors';
import { typography } from '../../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../../shared/theme/spacing';

const createCompanySchema = z.object({
  name: z.string().min(1, 'Nome da empresa é obrigatório'),
  description: z.string().optional(),
});

type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

export function CreateCompanyScreen() {
  const navigation = useNavigation();
  const createCompanyMutation = useCreateCompany();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateCompanyFormData) => {
    try {
      await createCompanyMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
      });

      Alert.alert('Sucesso', 'Empresa criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível criar a empresa. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Section */}
        <View style={styles.formSection}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome da Empresa *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                placeholder="Ex: MotoPay Delivery, Uber Moto"
                autoCapitalize="words"
              />
            )}
          />

          <View style={styles.inputSpacing} />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={styles.label}>Descrição (opcional)</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    errors.description && styles.textAreaError,
                  ]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Descreva sua empresa..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {errors.description && (
                  <Text style={styles.errorText}>
                    {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Error Display */}
        {createCompanyMutation.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {createCompanyMutation.error.message || 'Erro ao criar empresa'}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Criar Empresa"
            onPress={handleSubmit(onSubmit)}
            disabled={createCompanyMutation.isPending}
            loading={createCompanyMutation.isPending}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  inputSpacing: {
    height: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  textArea: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textAreaError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  errorContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

