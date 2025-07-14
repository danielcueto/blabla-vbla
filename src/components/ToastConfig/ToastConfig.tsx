import React, { JSX } from 'react'
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message'
import type { ToastConfigParams } from 'react-native-toast-message'
import { styles } from './ToastConfig.styles'

/**
 * Map of toast types to render functions.
 */
export type ToastConfigurationMap = Record<
  'success' | 'error' | 'info',
  (props: ToastConfigParams<any>) => JSX.Element
>

/**
 * Custom toast configuration for 'success', 'error', and 'info'.
 */
const toastConfig: ToastConfigurationMap = {
  success: props => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.successStyle]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.primaryText, styles.successText]}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      style={[styles.baseToast, styles.errorStyle]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.primaryText, styles.errorText]}
    />
  ),

  info: props => (
    <InfoToast
      {...props}
      style={[styles.baseToast, styles.infoStyle]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.primaryText, styles.infoText]}
    />
  ),
}

export default toastConfig
