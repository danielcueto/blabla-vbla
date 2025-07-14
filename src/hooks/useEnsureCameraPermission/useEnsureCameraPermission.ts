import { useEffect, useState } from 'react'
import { useCameraPermission } from 'react-native-vision-camera'

export interface EnsureCameraPermissionResult {
  isPermissionChecked: boolean
  isPermissionGranted: boolean
}

export default function useEnsureCameraPermission(): EnsureCameraPermissionResult {
  const { hasPermission, requestPermission } = useCameraPermission()
  const [isPermissionChecked, setIsPermissionChecked] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAndRequestPermission = async (): Promise<void> => {
      try {
        if (!hasPermission) {
          await requestPermission()
        }
      } catch {
      }
      if (isMounted) {
        setIsPermissionChecked(true)
      }
    }

    checkAndRequestPermission()

    return () => {
      isMounted = false
    }
  }, [hasPermission, requestPermission])

  return {
    isPermissionChecked,
    isPermissionGranted: hasPermission,
  }
}
