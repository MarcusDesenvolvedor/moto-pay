import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  AnimationDurations,
  AnimationScales,
  AnimationOpacity,
} from '../../animations/tokens';

interface AnimatedTabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color: string;
  focused: boolean;
}

export function AnimatedTabIcon({
  name,
  size = 24,
  color,
  focused,
}: AnimatedTabIconProps) {
  const scale = useSharedValue(focused ? AnimationScales.active : AnimationScales.inactive);
  const opacity = useSharedValue(focused ? AnimationOpacity.active : AnimationOpacity.inactive);

  useEffect(() => {
    scale.value = withTiming(
      focused ? AnimationScales.active : AnimationScales.inactive,
      {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      }
    );
    opacity.value = withTiming(
      focused ? AnimationOpacity.active : AnimationOpacity.inactive,
      {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      }
    );
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

