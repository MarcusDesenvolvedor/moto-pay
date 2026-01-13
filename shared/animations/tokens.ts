/**
 * Animation Tokens
 * 
 * Reusable animation constants for consistent motion across the app.
 * Inspired by Instagram, Nubank, and iFood motion design.
 */

export const AnimationDurations = {
  fast: 100,
  normal: 180,
  slow: 250,
} as const;

export const AnimationEasing = {
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  easeInOut: 'ease-in-out',
} as const;

export const AnimationScales = {
  press: 0.97,
  active: 1.1,
  inactive: 1,
} as const;

export const AnimationOpacity = {
  active: 1,
  inactive: 0.6,
  pressed: 0.9,
  hidden: 0,
  visible: 1,
} as const;

export const AnimationTranslate = {
  tabLabel: 4,
  cardMount: 8,
  screenEnter: 20,
  screenExit: -10,
} as const;

// Reanimated easing functions
export const EasingFunctions = {
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const;





