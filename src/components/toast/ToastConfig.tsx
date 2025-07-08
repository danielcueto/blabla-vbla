import { StyleSheet } from 'react-native';
import {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

const styles = StyleSheet.create({
  baseToast: {
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    minHeight: 70,
  },
  baseContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
  },
  baseText1: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  baseText2: {
    fontSize: 14,
    opacity: 0.8,
  },
  
  successColors: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  errorColors: {
    borderLeftColor: '#F44336',
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  infoColors: {
    borderLeftColor: '#2196F3',
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  
  successText1: {
    color: '#2E7D32',
  },
  successText2: {
    color: '#388E3C',
  },
  errorText1: {
    color: '#C62828',
  },
  errorText2: {
    color: '#D32F2F',
  },
  infoText1: {
    color: '#1565C0',
  },
  infoText2: {
    color: '#1976D2',
  },
});

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.successColors]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.baseText1, styles.successText1]}
      text2Style={[styles.baseText2, styles.successText2]}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={[styles.baseToast, styles.errorColors]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.baseText1, styles.errorText1]}
      text2Style={[styles.baseText2, styles.errorText2]}
    />
  ),

  info: (props: any) => (
    <InfoToast
      {...props}
      style={[styles.baseToast, styles.infoColors]}
      contentContainerStyle={styles.baseContainer}
      text1Style={[styles.baseText1, styles.infoText1]}
      text2Style={[styles.baseText2, styles.infoText2]}
    />
  ),
};


export { toastConfig };