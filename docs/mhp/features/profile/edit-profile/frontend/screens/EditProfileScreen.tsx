import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as FileSystem from 'expo-file-system/legacy';
import { useEditProfile } from '../hooks/use-edit-profile';
import { ProfileAvatarEdit } from '../../../frontend/components/ProfileAvatarEdit';
import { Input } from '../../../../../../../shared/components/Input';
import { Button } from '../../../../../../../shared/components/Button';
import { Loading } from '../../../../../../../shared/components/Loading';
import { colors } from '../../../../../../../shared/theme/colors';
import { typography } from '../../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../../shared/theme/spacing';

const editProfileSchema = z.object({
  fullName: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export function EditProfileScreen() {
  const navigation = useNavigation();
  const {
    profile,
    isLoading,
    updateProfile,
    isUpdating,
    updateError,
    uploadAvatar,
    isUploadingAvatar,
  } = useEditProfile();
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        email: profile.email,
      });
      setLocalAvatarUri(profile.avatarUrl || null);
    }
  }, [profile, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      // Update profile name
      await updateProfile({
        fullName: data.fullName,
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
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
        'Não foi possível atualizar o perfil. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  const handleAvatarSelected = async (uri: string) => {
    try {
      // Show local preview immediately
      setLocalAvatarUri(uri);

      // Convert image to base64
      let base64: string;
      
      if (Platform.OS === 'web') {
        // For web, use fetch to read the file
        const response = await fetch(uri);
        const blob = await response.blob();
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix
            const base64String = result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // For mobile, use FileSystem legacy API
        // Using legacy API for compatibility with expo-file-system v19+
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const imageBase64 = `data:image/jpeg;base64,${base64}`;

      // Upload to Cloudinary via backend
      await uploadAvatar(imageBase64);

      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
    } catch (error: any) {
      // Revert to previous avatar on error
      setLocalAvatarUri(profile?.avatarUrl || null);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Não foi possível fazer upload da foto. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Erro ao carregar perfil</Text>
        </View>
      </View>
    );
  }

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
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <ProfileAvatarEdit
            imageUri={localAvatarUri}
            onImageSelected={handleAvatarSelected}
            size={120}
          />
          <Text style={styles.avatarHint}>
            Toque na foto para alterar
          </Text>
          {isUploadingAvatar && (
            <Text style={styles.uploadingText}>Enviando foto...</Text>
          )}
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
              />
            )}
          />

          <View style={styles.inputSpacing} />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
                style={styles.disabledInput}
              />
            )}
          />

          <Text style={styles.emailHint}>
            O email não pode ser alterado
          </Text>
        </View>


        {/* Error Display */}
        {updateError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {updateError?.message || 'Erro ao atualizar perfil'}
            </Text>
          </View>
        )}

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Salvar"
            onPress={handleSubmit(onSubmit)}
            disabled={isUpdating}
            loading={isUpdating}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  avatarHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  inputSpacing: {
    height: spacing.md,
  },
  disabledInput: {
    opacity: 0.6,
  },
  emailHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  uploadingText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
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
  errorText: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
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

