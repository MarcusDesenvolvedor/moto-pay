import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  AnimationDurations,
  AnimationOpacity,
  AnimationTranslate,
} from '../../animations/tokens';

interface AnimatedTabLabelProps {
  label: string;
  focused: boolean;
  style?: TextStyle;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function AnimatedTabLabel({
  label,
  focused,
  style,
}: AnimatedTabLabelProps) {
  const opacity = useSharedValue(focused ? AnimationOpacity.active : AnimationOpacity.inactive);
  const translateY = useSharedValue(focused ? 0 : AnimationTranslate.tabLabel);

  useEffect(() => {
    opacity.value = withTiming(
      focused ? AnimationOpacity.active : AnimationOpacity.inactive,
      {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      }
    );
    translateY.value = withTiming(focused ? 0 : AnimationTranslate.tabLabel, {
      duration: AnimationDurations.normal,
      easing: Easing.out(Easing.quad),
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <AnimatedText style={[style, animatedStyle]}>
      {label}
    </AnimatedText>
  );
}

