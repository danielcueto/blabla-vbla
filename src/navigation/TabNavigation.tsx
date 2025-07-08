import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraHome } from '../screens/CameraHome';

const Tab = createBottomTabNavigator();

export function TabNavigation() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {
          paddingHorizontal: 23.5,
          paddingTop: 15,
          paddingBottom: Math.max(insets.bottom, 15),
          height: 70 + Math.max(insets.bottom, 15),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 10,
          fontFamily: 'Gilroy-SemiBold',
        },
      })}
    >
      <Tab.Screen name="CameraHome" component={CameraHome} />
    </Tab.Navigator>
  );
}
