import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme/colors';
import { typography } from '../shared/theme/typography';
import { spacing } from '../shared/theme/spacing';
import { Button } from '../shared/components/Button';
import { useLogout } from '../docs/mhp/features/authentication/frontend';

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

function HomeScreen() {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MotoPay</Text>
      <Text style={styles.subtitle}>Bem-vindo!</Text>
      <Button
        title="Sair"
        onPress={handleLogout}
        loading={logoutMutation.isPending}
        variant="outline"
        style={styles.logoutButton}
      />
    </View>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    marginTop: spacing.lg,
    minWidth: 120,
  },
});

