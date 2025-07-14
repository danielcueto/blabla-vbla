import React, { JSX, useRef, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  useWindowDimensions,
} from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import FAIcon from 'react-native-vector-icons/FontAwesome5'
import DeviceInfo from 'react-native-device-info'
import Toast from 'react-native-toast-message'
import  useEnsureCameraPermission  from '../../hooks/useEnsureCameraPermission/useEnsureCameraPermission'
import { useCapturePhoto } from '../../hooks/useCapturePhoto'
import { styles } from './CameraView.styles' 

export default function CameraView(): JSX.Element {
  const hasPermission = useEnsureCameraPermission()
  const camRef = useRef<Camera | null>(null)
  const { capturePhoto, isCapturing } = useCapturePhoto(camRef)
  const isSimulator = DeviceInfo.isEmulatorSync()
  const { width, height } = useWindowDimensions()

  const devices = useCameraDevices()
  const device = !isSimulator
  ? devices.find(cameraDevice => cameraDevice.position === 'back')
  ?? devices.find(cameraDevice => cameraDevice.position === 'front')
  : undefined
  
  const [previewUri, setPreviewUri] = useState<string | null>(null)

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#7bb3ef" />
        <Text style={styles.permissionText}>
          Requesting camera permissions...
        </Text>
      </View>
    )
  }

  const handleCapture = async (): Promise<void> => {
    if (isSimulator) {
      Toast.show({
        type: 'info',
        text1: 'Capture not available.',
        position:'bottom',
      })
      return
    }

    const uri = await capturePhoto()
    if (uri) {
      setPreviewUri(uri)
      Toast.show({ type: 'success', text1: 'Photo captured!', position: 'bottom' })
    } else {
      Toast.show({ type: 'error', text1: 'Failed to take photo.', position: 'bottom' })
    }
  }

  const handleRetake = (): void => {
    setPreviewUri(null)
  }

  const captureButtonOffset = height * 0.08
  const retakeButtonOffset = width * 0.05

  return (
    <View style={styles.container}>
      {previewUri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: previewUri }}
            style={styles.previewImage}
            resizeMode="contain"
            testID="preview-image"
          />
          <TouchableOpacity
            testID="retake-button"
            style={[
              styles.retakeButton,
              { top: captureButtonOffset, left: retakeButtonOffset },
            ]}
            onPress={handleRetake}
          >
            <FAIcon name="redo-alt" size={24} color="#FFF" />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {device ? (
            <Camera
              ref={camRef}
              style={styles.cameraFill}
              device={device}
              isActive
              photo
            />
          ) : (
            <View style={styles.noCameraContainer}>
              <Text style={styles.noCameraText}>
                Camera unavailable on simulator.
              </Text>
            </View>
          )}

          {isCapturing && (
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={styles.loadingIndicator}
            />
          )}

          <TouchableOpacity
            testID="snap-button"
            style={[
              styles.captureButton,
              { bottom: captureButtonOffset },
              isCapturing && styles.disabledButton,
            ]}
            disabled={isCapturing}
            onPress={handleCapture}
          >
            <FAIcon name="camera" size={36} color="#FFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
