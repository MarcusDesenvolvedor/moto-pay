import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../docs/mhp/features/authentication/frontend/screens/login-screen';
import { SignupScreen } from '../docs/mhp/features/authentication/frontend/screens/signup-screen';
import { colors } from '../shared/theme/colors';
import { stackTransitionConfig } from '../shared/animations/transitions';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        ...stackTransitionConfig,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignupScreen} />
    </Stack.Navigator>
  );
}

