import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../docs/mhp/features/profile/frontend';
import { EditProfileScreen } from '../docs/mhp/features/profile/edit-profile/frontend';
import { VehiclesListScreen } from '../docs/mhp/features/vehicles/frontend/screens/VehiclesListScreen';
import { AddVehicleScreen } from '../docs/mhp/features/vehicles/frontend';
import { CompaniesListScreen, CreateCompanyScreen } from '../docs/mhp/features/companies/create-company/frontend';
import { SecurityScreen } from '../docs/mhp/features/security/frontend/screens/SecurityScreen';
import { colors } from '../shared/theme/colors';
import { stackTransitionConfig } from '../shared/animations/transitions';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  VehiclesList: undefined;
  AddVehicle: undefined;
  CompaniesList: undefined;
  CreateCompany: undefined;
  Security: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: { backgroundColor: colors.background },
        ...stackTransitionConfig,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VehiclesList"
        component={VehiclesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompaniesList"
        component={CompaniesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCompany"
        component={CreateCompanyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

