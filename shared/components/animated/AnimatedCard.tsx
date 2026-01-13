import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import {
  AnimationDurations,
  AnimationOpacity,
  AnimationTranslate,
} from '../../animations/tokens';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

export function AnimatedCard({
  children,
  style,
  delay = 0,
}: AnimatedCardProps) {
  const opacity = useSharedValue(AnimationOpacity.hidden);
  const translateY = useSharedValue(AnimationTranslate.cardMount);

  useEffect(() => {
    opacity.value = withTiming(AnimationOpacity.visible, {
      duration: AnimationDurations.normal,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(0, {
      duration: AnimationDurations.normal,
      easing: Easing.out(Easing.quad),
    });
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
});

