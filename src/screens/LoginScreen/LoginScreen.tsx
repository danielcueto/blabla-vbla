import React, { JSX } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginView from '../../components/LoginView/LoginView'
import { styles } from './LoginScreen.styles'

export default function LoginScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <LoginView />
    </SafeAreaView>
  )
}
