import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import { TabNavigation } from './TabNavigation';
import StoryScreen from '../screens/StoryScreen/StoryScreen';
const Stack = createNativeStackNavigator();
export function StackNavigation() {
  return (
    <>
      <Stack.Navigator id={undefined}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={TabNavigation}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="StoryNavigation"
          component={StoryScreen}
        />
      </Stack.Navigator>
    </>
  );
}
