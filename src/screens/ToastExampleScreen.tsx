import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ToastExampleScreen() {
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: "allo",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplo de Toast</Text>
      <Button title="Mostrar Toast" onPress={showToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
    color: '#333',
  },
});
