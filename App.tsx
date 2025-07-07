import { StyleSheet, Text, View } from 'react-native';

function App() {

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
