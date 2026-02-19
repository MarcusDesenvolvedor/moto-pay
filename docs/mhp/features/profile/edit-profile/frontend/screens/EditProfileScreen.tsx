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
import { useEditProfile } from '../hooks/use-edit-profile';
import { ProfileAvatarEdit } from '../../../frontend/components/ProfileAvatarEdit';
import { Input } from '../../../../../../../shared/components/Input';
import { Button } from '../../../../../../../shared/components/Button';
import { Loading } from '../../../../../../../shared/components/Loading';
import { colors } from '../../../../../../../shared/theme/colors';
import { typography } from '../../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../../shared/theme/spacing';
import { ScreenHeader } from '../../../../../../../shared/components/ScreenHeader';

const editProfileSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
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

      Alert.alert('Success', 'Profile updated successfully!', [
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
        'Could not update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleAvatarSelected = async (uri: string) => {
    try {
      setLocalAvatarUri(uri);

      const result = await uploadAvatar(uri);
      const newAvatarUrl = result?.data?.avatarUrl ?? null;

      if (newAvatarUrl) {
        setLocalAvatarUri(newAvatarUrl);
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error: unknown) {
      setLocalAvatarUri(profile?.avatarUrl || null);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ??
        err?.message ??
        'Could not upload photo. Please try again.';
      Alert.alert('Error', errorMessage);
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
          <Text style={styles.emptyText}>Error loading profile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Profile" showBackButton />
      <KeyboardAvoidingView
        style={styles.flex}
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
            isUploading={isUploadingAvatar}
          />
          <Text style={styles.avatarHint}>
            Tap on the photo to change
          </Text>
          {isUploadingAvatar && (
            <Text style={styles.uploadingText}>Uploading photo...</Text>
          )}
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                placeholder="Enter your full name"
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
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
                style={styles.disabledInput}
              />
            )}
          />

          <Text style={styles.emailHint}>
            Email cannot be changed
          </Text>
        </View>


        {/* Error Display */}
        {updateError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {updateError?.message || 'Error updating profile'}
            </Text>
          </View>
        )}

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save"
            onPress={handleSubmit(onSubmit)}
            disabled={isUpdating}
            loading={isUpdating}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

