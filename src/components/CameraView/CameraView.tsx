import React, { JSX, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  useWindowDimensions,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';

import useEnsureCameraPermission from '../../hooks/useEnsureCameraPermission/ensureCameraPermission.hook';
import { useCapturePhoto } from '../../hooks/useCapturePhoto/useCapturePhoto.hook';
import { usePickPhotoFromGallery } from '../../hooks/usePickPhotoFromGallery/usePickPhotoFromGallery';
import {
  EDGE_BUTTON_SIZE,
  CONTROLS_VERTICAL_OFFSET_RATIO,
} from '../../config/config';
import { spacing } from '../../config/theme';
import { styles } from './CameraView.styles';

/**
 * CameraView allows capturing a new photo or picking one from the device gallery.
 * Gallery and camera share the same permission flow. Simulator-only toasts are
 * guarded by __DEV__ so they don't appear in production.
 *
 * @returns {JSX.Element}
 */
export default function CameraView(): JSX.Element {
  const hasPermission = useEnsureCameraPermission();
  const camRef = useRef<Camera | null>(null);
  const { capturePhoto, isCapturing } = useCapturePhoto(camRef);
  const { pickPhoto, isPicking } = usePickPhotoFromGallery();
  const isSimulator = DeviceInfo.isEmulatorSync();
  const { height } = useWindowDimensions();
  const devices = useCameraDevices();
  const device = !isSimulator
    ? devices.find(d => d.position === 'back') ?? devices.find(d => d.position === 'front')
    : undefined;

  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // Responsive vertical offset for bottom controls
  const controlsOffsetY = height * CONTROLS_VERTICAL_OFFSET_RATIO;

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#7bb3ef" />
        <Text style={styles.permissionText}>Requesting camera permissions...</Text>
      </View>
    );
  }

  /**
   * Handles capturing a new photo.
   */
  const captureHandler = async (): Promise<void> => {
    if (isSimulator) {
      if (__DEV__) Toast.show({ type: 'info', text1: 'Capture not available on simulator.', position: 'bottom' });
      return;
    }
    const uri = await capturePhoto();
    if (uri) {
      setPreviewUri(uri);
      Toast.show({ type: 'success', text1: 'Success', position: 'bottom' });
    } else {
      Toast.show({ type: 'error', text1: 'Failed to take photo.', position: 'bottom' });
    }
  };

  /**
   * Handles picking a photo from gallery.
   */
  const galleryHandler = async (): Promise<void> => {
    if (isSimulator) {
      if (__DEV__) Toast.show({ type: 'info', text1: 'Gallery not available on simulator.', position: 'bottom' });
      return;
    }
    const uri = await pickPhoto();
    if (uri) {
      setPreviewUri(uri);
      Toast.show({ type: 'success', text1: 'The photo was successfully uploaded', position: 'bottom' });
    } else {
      Toast.show({ type: 'error', text1: 'Oops there is an error with server please contact with the administrator', position: 'bottom' });
    }
  };

  /**
   * Resets the preview to return to live camera mode.
   */
  const retakeHandler = (): void => setPreviewUri(null);

  return (
    <View style={styles.container}>
      {previewUri ? (
        <View style={styles.previewContainer}>
          <Image
            testID="preview-image"
            source={{ uri: previewUri }}
            style={styles.previewPhoto}
            resizeMode="contain"
          />
          <TouchableOpacity
            testID="close-preview-button"
            style={[styles.retakeButton, { top: controlsOffsetY, left: spacing.medium }]}
            onPress={retakeHandler}
          >
            <FAIcon name="times" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {device ? (
            <Camera ref={camRef} style={styles.cameraFill} device={device} isActive photo />
          ) : (
            <View style={styles.noCameraContainer}>
              <Text style={styles.noCameraText}>Camera unavailable on simulator.</Text>
            </View>
          )}

          {isCapturing && <ActivityIndicator size="large" color="#FFF" style={styles.loadingIndicator} />}

          {/* Bottom controls: gallery | shutter | placeholder */}
          <View style={[styles.controlsContainer, { bottom: controlsOffsetY }]}>            
            <TouchableOpacity
              testID="gallery-button"
              style={[styles.edgeButton, isPicking && styles.disabled]}
              disabled={isPicking}
              onPress={galleryHandler}
            >
              {isPicking ? <ActivityIndicator size="small" color="#FFF" /> : <FAIcon name="images" size={EDGE_BUTTON_SIZE * 0.6} color="#FFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              testID="snap-button"
              style={[styles.captureButton, isCapturing && styles.disabled]}
              disabled={isCapturing}
              onPress={captureHandler}
            >
              <FAIcon name="camera" size={36} color="#FFF" />
            </TouchableOpacity>

            {/* Placeholder edge to keep shutter centered */}
            <View style={styles.edgeButton} />
          </View>
        </>
      )}
    </View>
  );
}