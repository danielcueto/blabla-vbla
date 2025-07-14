import React, { JSX } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import CameraHome from '../screens/CameraHomeScreen/CameraHomeScreen';

const Tab = createBottomTabNavigator();

/**
 * Icon component for the Camera tab.
 */
function CameraTabIcon({ color, size }: { color: string; size: number }): JSX.Element {
  return <FAIcon name="camera" size={size} color={color} />;
}

/**
 * Bottom tab navigator with a centered camera icon.
 */
export function TabNavigation(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          height: 64 + Math.max(insets.bottom, 16),
          borderTopWidth: 0,
          backgroundColor: '#000',
        },
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 10,
          fontFamily: 'Gilroy-SemiBold',
          color: '#FFF',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tab.Screen
        name="CameraHome"
        component={CameraHome}
        options={{
          title: 'Camera',
          tabBarIcon: CameraTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
