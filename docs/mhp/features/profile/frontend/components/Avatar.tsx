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

interface AvatarProps {
  imageUri?: string | null;
  onImageSelected?: (uri: string) => void;
  size?: number;
  editable?: boolean;
}

export function Avatar({
  imageUri,
  onImageSelected,
  size = 120,
  editable = true,
}: AvatarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = async () => {
    if (!editable) return;

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar suas fotos.',
        );
        return;
      }

      // Launch image picker
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
        setIsLoading(true);

        try {
          // Resize and compress image
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [
              {
                resize: {
                  width: 512,
                  height: 512,
                },
              },
            ],
            {
              compress: 0.7,
              format: ImageManipulator.SaveFormat.JPEG,
            },
          );

          // Check file size (approximate)
          // Note: Actual file size check would require FileSystem API
          // For now, we rely on compression settings

          if (onImageSelected) {
            onImageSelected(manipulatedImage.uri);
          }
        } catch (error) {
          console.error('Error processing image:', error);
          Alert.alert('Erro', 'Não foi possível processar a imagem.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleImagePicker}
      disabled={!editable || isLoading}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.avatarContainer, { width: size, height: size }]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person" size={size * 0.5} color={colors.textSecondary} />
          </View>
        )}
        {editable && !isLoading && (
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={16} color={colors.text} />
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
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});

