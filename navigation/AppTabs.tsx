import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeReportsScreen } from '../docs/mhp/features/reports/frontend';
import { colors } from '../shared/theme/colors';
import { typography } from '../shared/theme/typography';
import { spacing } from '../shared/theme/spacing';

export type AppTabsParamList = {
  Home: undefined;
  Vehicles: undefined;
  Add: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function VehiclesPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Vehicles</Text>
    </View>
  );
}

function AddPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Add</Text>
    </View>
  );
}

function ProfilePlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Profile</Text>
    </View>
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeReportsScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehiclesPlaceholder}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddPlaceholder}
        options={{
          tabBarLabel: 'Adicionar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePlaceholder}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  tabBarLabel: {
    ...typography.label,
    fontSize: 12,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderText: {
    ...typography.h2,
    color: colors.textSecondary,
  },
});

