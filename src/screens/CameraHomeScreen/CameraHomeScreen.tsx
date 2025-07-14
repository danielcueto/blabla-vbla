import React, { JSX } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CameraView from '../../components/CameraView/CameraView'
import { styles } from './CameraHomeScreen.styles'

export default function CameraHomeScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <CameraView />
    </SafeAreaView>
  )
}
