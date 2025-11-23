
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/dashboard',
      icon: 'house',
      label: 'Dashboard',
    },
    {
      name: 'drawing',
      route: '/(tabs)/drawing',
      icon: 'pencil',
      label: 'Drawing',
    },
    {
      name: 'crm',
      route: '/(tabs)/crm',
      icon: 'person-2',
      label: 'CRM',
    },
    {
      name: 'operations',
      route: '/(tabs)/operations',
      icon: 'wrench',
      label: 'Operations',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="drawing" name="drawing" />
        <Stack.Screen key="crm" name="crm" />
        <Stack.Screen key="estimator" name="estimator" />
        <Stack.Screen key="operations" name="operations" />
        <Stack.Screen key="insurance" name="insurance" />
        <Stack.Screen key="integrations" name="integrations" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
