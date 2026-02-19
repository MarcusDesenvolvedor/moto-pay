import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Input } from '../../../../../../shared/components/Input';
import { Button } from '../../../../../../shared/components/Button';
import { AuthHeader } from '../../../../../../shared/components/AuthHeader';
import { useLogin } from '../hooks/use-login';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const loginMutation = useLogin();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error: unknown) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 404 || axiosError.response?.status === 0) {
          errorMessage = 'Connection error. Please verify the server is running.';
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Check your connection and server availability.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <AuthHeader
            title="MotoPay"
            subtitle="Sign in to continue"
          />

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <Text
              style={styles.forgotPassword}
              onPress={() => {
                Alert.alert(
                  'Password Recovery',
                  'Password recovery will be available soon.',
                );
              }}
            >
              Forgot your password?
            </Text>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loginMutation.isPending}
              style={styles.button}
            />

            <Button
              title="Create account"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    ...typography.bodySmall,
    color: colors.primaryLight,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});
