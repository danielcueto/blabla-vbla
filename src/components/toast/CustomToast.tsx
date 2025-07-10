import Toast, { ToastPosition } from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

type CustomToastProps = {
  type: ToastType;
  message: string;
  description?: string;
  durationSeconds?: number;
  position?: ToastPosition;
  onShow?: () => void;
  onHide?: () => void;
};

export const showCustomToast = ({
  type,
  message,
  description = '',
  durationSeconds = 3,
  position = 'bottom',
  onShow,
  onHide,
}: CustomToastProps) => {
  Toast.show({
    type,
    text1: message,
    text2: description,
    visibilityTime: durationSeconds * 1000,
    position,
    onShow,
    onHide,
  });
};
