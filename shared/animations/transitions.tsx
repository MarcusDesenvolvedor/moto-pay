import { TransitionSpec, CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from 'react-native';
import { AnimationDurations } from './tokens';

/**
 * Custom screen transition configuration
 * Subtle slide and fade animation for stack navigation
 */
export const screenTransitionConfig: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: AnimationDurations.normal,
    easing: Easing.out(Easing.poly(3)),
  },
};

/**
 * Card style interpolator for stack navigation
 * Provides smooth slide and fade transitions
 */
export const cardStyleInterpolator = CardStyleInterpolators.forHorizontalIOS;

/**
 * Custom transition configuration for stack navigator
 */
export const stackTransitionConfig = {
  transitionSpec: {
    open: screenTransitionConfig,
    close: screenTransitionConfig,
  },
  cardStyleInterpolator,
};

