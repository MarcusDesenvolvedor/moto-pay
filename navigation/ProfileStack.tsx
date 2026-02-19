import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../docs/mhp/features/profile/frontend';
import { EditProfileScreen } from '../docs/mhp/features/profile/edit-profile/frontend';
import { VehiclesListScreen } from '../docs/mhp/features/vehicles/frontend/screens/VehiclesListScreen';
import { AddVehicleScreen } from '../docs/mhp/features/vehicles/frontend';
import { CompaniesListScreen, CreateCompanyScreen } from '../docs/mhp/features/companies/create-company/frontend';
import { SecurityScreen } from '../docs/mhp/features/security/frontend/screens/SecurityScreen';
import { colors } from '../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
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
        options={({ navigation }) => ({
          title: 'Edit Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="VehiclesList"
        component={VehiclesListScreen}
        options={({ navigation }) => ({
          title: 'My Vehicles',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={({ navigation }) => ({
          title: 'Add Vehicle',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CompaniesList"
        component={CompaniesListScreen}
        options={({ navigation }) => ({
          title: 'My Companies',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CreateCompany"
        component={CreateCompanyScreen}
        options={({ navigation }) => ({
          title: 'Create Company',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={({ navigation }) => ({
          title: 'Security',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

