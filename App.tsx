import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/toast/ToastConfig';
import { AuthProvider } from './src/contexts/AuthContext';

function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AuthProvider>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </AuthProvider>
        <Toast config={toastConfig} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
