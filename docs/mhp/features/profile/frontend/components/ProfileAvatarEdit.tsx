import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors } from '../../../../../../shared/theme/colors';

interface ProfileAvatarEditProps {
  imageUri?: string | null;
  onImageSelected?: (uri: string) => void;
  size?: number;
  isUploading?: boolean;
}

export function ProfileAvatarEdit({
  imageUri,
  onImageSelected,
  size = 120,
  isUploading = false,
}: ProfileAvatarEditProps) {
  const [isPicking, setIsPicking] = useState(false);

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your photos.',
        );
        return;
      }

      // Crop first (allowsEditing), then resize and compress
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets[0]) {
        setIsPicking(true);

        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 512, height: 512 } }],
            {
              compress: 0.6,
              format: ImageManipulator.SaveFormat.JPEG,
            },
          );

          onImageSelected?.(manipulatedImage.uri);
        } catch (error) {
          console.error('Error processing image:', error);
          Alert.alert('Error', 'Could not process the image.');
        } finally {
          setIsPicking(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not select the image.');
    }
  };

  const isLoading = isPicking || isUploading;

  return (
    <TouchableOpacity
      onPress={handleImagePicker}
      disabled={isLoading}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        {isLoading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person" size={size * 0.5} color={colors.textSecondary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 3,
    borderColor: colors.primary,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingOverlay: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
});









