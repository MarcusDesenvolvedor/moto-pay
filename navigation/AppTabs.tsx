import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { HomeReportsScreen } from '../docs/mhp/features/reports/frontend';
import { AddTransactionScreen } from '../docs/mhp/features/add-transaction/frontend';
import { AddVehicleScreen } from '../docs/mhp/features/vehicles/frontend';
import { ProfileStack } from './ProfileStack';
import { colors } from '../shared/theme/colors';
import { typography } from '../shared/theme/typography';
import { spacing } from '../shared/theme/spacing';
import { AnimatedTabIcon } from '../shared/components/animated/AnimatedTabIcon';
import { AnimatedTabLabel } from '../shared/components/animated/AnimatedTabLabel';

export type AppTabsParamList = {
  Home: undefined;
  Vehicles: undefined;
  Add: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

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
          tabBarLabel: ({ focused, color }) => (
            <AnimatedTabLabel
              label="Home"
              focused={focused}
              style={[styles.tabBarLabel, { color }]}
            />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="home"
              size={size || 24}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={AddVehicleScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <AnimatedTabLabel
              label="Vehicles"
              focused={focused}
              style={[styles.tabBarLabel, { color }]}
            />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="car"
              size={size || 24}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <AnimatedTabLabel
              label="Add"
              focused={focused}
              style={[styles.tabBarLabel, { color }]}
            />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="add-circle"
              size={size || 24}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <AnimatedTabLabel
              label="Profile"
              focused={focused}
              style={[styles.tabBarLabel, { color }]}
            />
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="person"
              size={size || 24}
              color={color}
              focused={focused}
            />
          ),
          headerShown: false,
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
});

