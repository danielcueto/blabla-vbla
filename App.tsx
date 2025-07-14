import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import  ToastConfigurationMap  from './src/components/ToastConfig/ToastConfig';
import { TabNavigation } from './src/navigation/TabNavigation';

function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <TabNavigation/>
        </NavigationContainer>
        <Toast config={ToastConfigurationMap} />
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
