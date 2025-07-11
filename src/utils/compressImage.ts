import { Image } from 'react-native-compressor';

export const compressImage = async (
  imageUri: string,
): Promise<{
  success: boolean;
  data?: string;
  base64?: string;
  error?: string;
}> => {
  try {
    const base64 = await Image.compress(imageUri, {
      maxWidth: 1080,
      maxHeight: 1080,
      quality: 0.8,
      compressionMethod: 'auto',
      returnableOutputType: 'base64',
    });

    const uri = `data:image/jpeg;base64,${base64}`;

    return {
      success: true,
      data: uri,
      base64,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to compress image: ${(error as Error).message}`,
    };
  }
};

export const convertImageToBase64 = async (
  imageUri: string,
): Promise<{ success: boolean; base64?: string; error?: string }> => {
  try {
    const base64 = await Image.compress(imageUri, {
      quality: 1, // sin compresión
      returnableOutputType: 'base64',
      compressionMethod: 'manual',
    });

    return { success: true, base64 };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
