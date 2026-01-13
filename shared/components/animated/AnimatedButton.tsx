import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import {
  AnimationDurations,
  AnimationScales,
  AnimationOpacity,
} from '../../animations/tokens';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withTiming(AnimationScales.press, {
      duration: AnimationDurations.fast,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(AnimationOpacity.pressed, {
      duration: AnimationDurations.fast,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withTiming(AnimationScales.inactive, {
      duration: AnimationDurations.fast,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(AnimationOpacity.active, {
      duration: AnimationDurations.fast,
      easing: Easing.out(Easing.quad),
    });
  };

  const buttonStyle: ViewStyle[] = [styles.button, styles[variant]];
  const textStyle: TextStyle[] = [styles.text, styles[`${variant}Text`]];

  if (disabled || loading) {
    buttonStyle.push(styles.disabled);
  }

  return (
    <AnimatedTouchable
      style={[buttonStyle, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.backgroundSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    color: colors.text,
  },
  primaryText: {
    color: colors.text,
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.primary,
  },
});

