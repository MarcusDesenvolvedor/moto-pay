import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AnimationDurations } from '../../animations/tokens';

interface AnimatedInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AnimatedInput({
  label,
  error,
  style,
  secureTextEntry,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (error) {
      progress.value = withTiming(2, {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      });
    } else if (isFocused) {
      progress.value = withTiming(1, {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      });
    } else {
      progress.value = withTiming(0, {
        duration: AnimationDurations.normal,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [isFocused, error]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1, 2],
      [colors.border, colors.primary, colors.error]
    );
    return {
      borderColor,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showPasswordToggle = !!secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <AnimatedView style={[styles.inputWrapper, animatedBorderStyle]}>
        <TextInput
          {...props}
          style={[
            styles.input,
            showPasswordToggle && styles.inputWithIcon,
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </AnimatedView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  input: {
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
    width: '100%',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  iconContainer: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -12,
    height: 24,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

