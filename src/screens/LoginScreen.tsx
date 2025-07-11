import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { compressImage, convertImageToBase64 } from '../utils/compressImage';
import { Image as RNImage } from 'react-native';

export const ImageCompressScreen = () => {
  const [originalUri, setOriginalUri] = useState(require('../../assets/images/IMG_3587.jpg'));
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number | null>(null);
  const [compressedSizeKB, setCompressedSizeKB] = useState<number | null>(null);

  const estimateBase64Size = (base64: string) => {
    return (base64.length * (3 / 4)) / 1024;
  };

  const handleCompress = async () => {
    const imageUri = RNImage.resolveAssetSource(originalUri).uri;

    // Obtener tamaño original en base64 sin compresión
    const originalResult = await convertImageToBase64(imageUri);
    if (!originalResult.success || !originalResult.base64) {
      Alert.alert('Error al obtener base64 de la imagen original');
      return;
    }
    const originalKB = estimateBase64Size(originalResult.base64);
    setOriginalSizeKB(originalKB);

    // Obtener imagen comprimida en base64
    const compressedResult = await compressImage(imageUri);
    if (!compressedResult.success || !compressedResult.data || !compressedResult.base64) {
      Alert.alert('Error al comprimir la imagen');
      return;
    }

    const compressedKB = estimateBase64Size(compressedResult.base64);
    setCompressedUri(compressedResult.data);
    setCompressedSizeKB(compressedKB);

    console.log('✅ Original size:', originalKB.toFixed(2), 'KB');
    console.log('✅ Compressed size:', compressedKB.toFixed(2), 'KB');
    console.log(`🔗 Open this in browser-base:\n${originalResult.base64}`);
    console.log(`🔗 Open this in browser:\n${compressedResult.data}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Image Compression Test (Base64)</Text>

      <Text style={styles.label}>Original Image:</Text>
      <Image source={originalUri} style={styles.image} resizeMode="contain" />
      {originalSizeKB !== null && (
        <Text style={styles.sizeText}>
          Original Base64 Size: {originalSizeKB.toFixed(2)} KB
        </Text>
      )}

      <Button title="Compress Image" onPress={handleCompress} />

      {compressedUri && (
        <>
          <Text style={styles.label}>Compressed Image:</Text>
          <Image source={{ uri: compressedUri }} style={styles.image} resizeMode="contain" />
          {compressedSizeKB !== null && (
            <Text style={styles.sizeText}>
              Compressed Base64 Size: {compressedSizeKB.toFixed(2)} KB
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  sizeText: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
});

export default ImageCompressScreen;
