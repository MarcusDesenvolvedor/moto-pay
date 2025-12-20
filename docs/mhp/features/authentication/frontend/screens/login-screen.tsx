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
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
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
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.status === 401) {
          errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 404 || axiosError.response?.status === 0) {
          errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          errorMessage = 'Erro de rede. Verifique sua conexão e se o servidor está acessível.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Erro ao fazer login', errorMessage);
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
            subtitle="Faça login para continuar"
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
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <Text
              style={styles.forgotPassword}
              onPress={() => {
                Alert.alert(
                  'Recuperação de senha',
                  'Password recovery will be available soon.',
                );
              }}
            >
              Esqueceu sua senha?
            </Text>

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loginMutation.isPending}
              style={styles.button}
            />

            <Button
              title="Criar conta"
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
