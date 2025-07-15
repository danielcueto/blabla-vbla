import { useState, useCallback } from 'react';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { withTimeout } from '../../utils/withTimeout';
import { GALLERY_PICK_TIMEOUT_MS, VALID_PHOTO_MIME_TYPES } from '../../config/config';

/**
 * Hook to pick a single photo from the device gallery with timeout and format validation.
 *
 * @returns {{
 *   pickPhoto: () => Promise<string | null>,
 *   isPicking: boolean,
 *   error: string | null
 * }}
 *   - pickPhoto: Async function that opens the native photo picker, enforces a timeout,
 *       validates the MIME type, and returns the selected photo URI or null.
 *   - isPicking: Boolean flag indicating whether the gallery picker is active.
 *   - error: Last error message, or null if there is none.
 */
export function usePickPhotoFromGallery() {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickPhoto = useCallback(async (): Promise<string | null> => {
    setIsPicking(true);
    setError(null);

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    try {
      const result = await withTimeout(
        launchImageLibrary(options),
        GALLERY_PICK_TIMEOUT_MS
      );

      const asset = result.assets?.[0] ?? null;
      if (!asset) {
        // User cancelled or no selection
        return null;
      }

      if (!asset.type || !VALID_PHOTO_MIME_TYPES.includes(asset.type)) {
        // Unsupported format
        setError('Invalid photo format');
        return null;
      }

      // Return the URI of the selected photo
      return asset.uri ?? null;
    } catch (e: any) {
      // Timeout or picker error
      setError(e.message ?? 'Unknown error');
      return null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  return { pickPhoto, isPicking, error };
}
