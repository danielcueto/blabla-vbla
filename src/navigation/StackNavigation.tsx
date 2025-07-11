import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageCompressScreen } from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
export function StackNavigation() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="LoginScreen"
        component={ImageCompressScreen}
      />
    </Stack.Navigator>
  );
}
