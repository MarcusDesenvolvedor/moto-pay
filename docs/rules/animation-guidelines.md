# Animation Guidelines

## Purpose

This document defines animation standards and principles for the MotoPay mobile app. Animations enhance UX by providing visual feedback, guiding user attention, and creating a premium, polished feel.

## Design Philosophy

Animations should be:
- **Subtle**: Enhance UX without distracting
- **Fast**: 100-250ms duration
- **Purposeful**: Every animation serves a clear purpose
- **Consistent**: Use standardized tokens across the app
- **Performant**: Never block UI or data operations

## Inspiration

Animations are inspired by premium apps:
- Instagram (smooth transitions, subtle feedback)
- Nubank (clean micro-interactions)
- iFood (fast, responsive feel)

---

## Animation Tokens

All animations use standardized tokens from `shared/animations/tokens.ts`:

### Durations
- **Fast**: 100ms - Quick feedback (button press)
- **Normal**: 180ms - Standard transitions (screen, tabs)
- **Slow**: 250ms - Complex animations (rarely used)

### Easing
- **Ease-out**: Default for most animations
- **Ease-in**: Rarely used
- **Ease-in-out**: Smooth transitions

### Scales
- **Press**: 0.97 - Button press feedback
- **Active**: 1.1 - Active tab icon
- **Inactive**: 1.0 - Default state

### Opacity
- **Active**: 1.0 - Fully visible
- **Inactive**: 0.6 - Secondary elements
- **Pressed**: 0.9 - Press feedback
- **Hidden**: 0.0 - Not visible

### Translate
- **Tab Label**: 4px - Label animation
- **Card Mount**: 8px - Card entrance
- **Screen Enter**: 20px - Screen transition
- **Screen Exit**: -10px - Screen exit

---

## Animation Types

### 1. Bottom Tab Bar Animations

**Location**: `navigation/AppTabs.tsx`

**Components**: `AnimatedTabIcon`, `AnimatedTabLabel`

**Behavior**:
- Active tab icon: scale 1 → 1.1, opacity 0.7 → 1
- Active tab label: fade in, translateY 4 → 0
- Duration: 180ms
- Easing: ease-out

**Implementation**:
```tsx
<AnimatedTabIcon
  name="home"
  size={24}
  color={color}
  focused={focused}
/>
```

### 2. Screen Transitions (Stack Navigation)

**Location**: `navigation/ProfileStack.tsx` and other stack navigators

**Configuration**: `shared/animations/transitions.tsx`

**Behavior**:
- Enter: translateX 20 → 0, opacity 0 → 1
- Exit: translateX 0 → -10, opacity 1 → 0
- Duration: 180ms
- Uses native driver for performance

**Implementation**:
```tsx
import { stackTransitionConfig } from '../shared/animations/transitions';

<Stack.Navigator
  screenOptions={{
    ...stackTransitionConfig,
  }}
/>
```

### 3. Micro-Interactions

#### Buttons

**Component**: `AnimatedButton` (replaces `Button`)

**Behavior**:
- Press: scale 1 → 0.97, opacity 1 → 0.9
- Release: scale 0.97 → 1, opacity 0.9 → 1
- Duration: 100ms
- Easing: ease-out

**Usage**:
```tsx
import { AnimatedButton } from '../shared/components/animated';

<AnimatedButton
  title="Save"
  onPress={handleSave}
  variant="primary"
/>
```

#### Input Fields

**Component**: `AnimatedInput` (optional replacement for `Input`)

**Behavior**:
- Border color transitions smoothly on focus
- Color: border → primary (yellow)
- Duration: 180ms
- Easing: ease-out

**Usage**:
```tsx
import { AnimatedInput } from '../shared/components/animated';

<AnimatedInput
  label="Email"
  value={email}
  onChangeText={setEmail}
/>
```

#### Cards

**Component**: `AnimatedCard`

**Behavior**:
- Mount: opacity 0 → 1, translateY 8 → 0
- Duration: 180ms
- Optional delay for staggered animations

**Usage**:
```tsx
import { AnimatedCard } from '../shared/components/animated';

<AnimatedCard delay={index * 50}>
  <CardContent />
</AnimatedCard>
```

---

## Performance Considerations

### Best Practices

1. **Use Native Driver**: All animations use `useNativeDriver: true` when possible
2. **Avoid Layout Animations**: Prefer transform and opacity
3. **Debounce Rapid Actions**: Prevent animation conflicts
4. **Cleanup**: Properly cleanup animations on unmount

### Performance Rules

- ✅ Use `transform` and `opacity` (GPU accelerated)
- ✅ Keep animations under 250ms
- ✅ Use `withTiming` for simple animations
- ❌ Avoid animating `width`, `height`, `top`, `left`
- ❌ No infinite animations
- ❌ No bounce or overshoot effects

---

## Accessibility

### Reduced Motion

Respect system preferences for reduced motion:
- Animations should be subtle by default
- Consider `AccessibilityInfo.isReduceMotionEnabled()` for future enhancements

### Visual Feedback

All interactive elements must provide:
- Clear visual feedback on interaction
- Sufficient contrast
- No reliance on color alone

---

## File Structure

```
shared/
  animations/
    tokens.ts          # Animation constants
    transitions.tsx    # Navigation transitions
    index.ts           # Exports
  components/
    animated/
      AnimatedButton.tsx
      AnimatedCard.tsx
      AnimatedInput.tsx
      AnimatedTabIcon.tsx
      AnimatedTabLabel.tsx
      index.ts
```

---

## Migration Guide

### Replacing Existing Components

1. **Button → AnimatedButton**
   ```tsx
   // Before
   import { Button } from '../shared/components/Button';
   
   // After
   import { AnimatedButton } from '../shared/components/animated';
   ```

2. **Input → AnimatedInput** (optional)
   ```tsx
   // Before
   import { Input } from '../shared/components/Input';
   
   // After
   import { AnimatedInput } from '../shared/components/animated';
   ```

3. **Cards → AnimatedCard**
   ```tsx
   // Wrap existing cards
   <AnimatedCard>
     <ExistingCardContent />
   </AnimatedCard>
   ```

---

## Future Enhancements

Potential future animation additions:
- Skeleton loaders with shimmer
- Pull-to-refresh animations
- Swipe gestures with haptic feedback
- List item animations (staggered entrance)
- Modal entrance/exit animations

---

## References

- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Navigation Transitions](https://reactnavigation.org/docs/stack-navigator/#animations)
- [Material Design Motion](https://material.io/design/motion/)

---

**Status**: Active  
**Type**: Design Guidelines  
**Version**: 1.0









