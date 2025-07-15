import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import { useCameraDevices } from 'react-native-vision-camera';

import CameraView from '../CameraView';

// Mock custom hooks and device APIs
jest.mock('../../../hooks/useEnsureCameraPermission', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../hooks/useCapturePhoto', () => ({
  useCapturePhoto: jest.fn(),
}));
jest.mock('../../../hooks/usePickPhotoFromGallery', () => ({
  usePickPhotoFromGallery: jest.fn(),
}));
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevices: jest.fn(),
}));
jest.mock('react-native-device-info', () => ({
  isEmulatorSync: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('CameraView component', () => {
  const mockEnsurePermission = require('../../../hooks/useEnsureCameraPermission').default as jest.Mock;
  const mockUseCapture = require('../../../hooks/useCapturePhoto').useCapturePhoto as jest.Mock;
  const mockUsePick = require('../../../hooks/usePickPhotoFromGallery').usePickPhotoFromGallery as jest.Mock;
  const mockDevices = useCameraDevices as jest.Mock;
  const mockIsEmulator = DeviceInfo.isEmulatorSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default hook behavior: permission granted, device present
    mockEnsurePermission.mockReturnValue(true);
    mockIsEmulator.mockReturnValue(false);
    mockDevices.mockReturnValue([{ position: 'back' }]);

    // Default capture and pick implementations
    mockUseCapture.mockReturnValue({ capturePhoto: jest.fn(), isCapturing: false });
    mockUsePick.mockReturnValue({ pickPhoto: jest.fn(), isPicking: false, error: null });
  });

  it('renders permission-loading state when camera permission is pending', () => {
    // Arrange: simulate permission not yet granted
    mockEnsurePermission.mockReturnValue(false);

    // Act
    const { getByText } = render(<CameraView />);

    // Assert
    expect(getByText('Requesting camera permissions...')).toBeTruthy();
  });

  it('displays preview and success toast when photo is chosen from gallery', async () => {
    // Arrange
    const mockUri = 'file://mockPhoto.jpg';
    const pickPhotoFn = jest.fn().mockResolvedValue(mockUri);
    mockUsePick.mockReturnValue({ pickPhoto: pickPhotoFn, isPicking: false, error: null });
    const { getByTestId, queryByTestId } = render(<CameraView />);

    // Act: user taps gallery button
    fireEvent.press(getByTestId('gallery-button'));

    // Assert: wait for gallery selection and UI update
    await waitFor(() => {
      expect(pickPhotoFn).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'The photo was successfully uploaded',
        position: 'bottom',
      });
      // Preview image should appear
      expect(queryByTestId('preview-image')).not.toBeNull();
    });
  });

  it('shows error toast when gallery selection is cancelled or fails', async () => {
    // Arrange: simulate cancellation
    const pickPhotoFn = jest.fn().mockResolvedValue(null);
    mockUsePick.mockReturnValue({ pickPhoto: pickPhotoFn, isPicking: false, error: null });
    const { getByTestId } = render(<CameraView />);

    // Act
    fireEvent.press(getByTestId('gallery-button'));

    // Assert
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Oops there is an error with server please contact with the administrator',
        position: 'bottom',
      });
    });
  });

  it('allows retaking the photo and returns to camera preview', async () => {
    // Arrange: simulate successful pick
    const mockUri = 'file://mockPhoto.jpg';
    mockUsePick.mockReturnValue({ pickPhoto: jest.fn().mockResolvedValue(mockUri), isPicking: false, error: null });
    const { getByTestId, queryByTestId } = render(<CameraView />);

    // Act: pick and then retake
    fireEvent.press(getByTestId('gallery-button'));
    await waitFor(() => expect(queryByTestId('preview-image')).not.toBeNull());
    fireEvent.press(getByTestId('retake-button'));

    // Assert: preview cleared, camera button present
    await waitFor(() => {
      expect(queryByTestId('preview-image')).toBeNull();
      expect(getByTestId('snap-button')).toBeTruthy();
    });
  });
});
