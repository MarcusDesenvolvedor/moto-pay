import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../../../../shared/theme/colors';
import { ImageViewerModal } from '../../../../../../shared/components/ImageViewerModal';
import DefaultAvatarSvg from '../../../../../../shared/assets/undraw_selfie-fun_0qzh.svg';

interface ProfileAvatarViewProps {
  imageUri?: string | null;
  size?: number;
}

export function ProfileAvatarView({
  imageUri,
  size = 120,
}: ProfileAvatarViewProps) {
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  const handlePress = () => {
    if (imageUri) {
      setIsImageViewerVisible(true);
    }
  };

  const handleCloseViewer = () => {
    setIsImageViewerVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={!imageUri}
        style={styles.container}
      >
        <View style={[styles.avatarContainer, { width: size, height: size }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.placeholder, { width: size, height: size }]}>
              <DefaultAvatarSvg width={size} height={size} />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <ImageViewerModal
        visible={isImageViewerVisible}
        imageUri={imageUri || null}
        onClose={handleCloseViewer}
      />
    </>
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
});









