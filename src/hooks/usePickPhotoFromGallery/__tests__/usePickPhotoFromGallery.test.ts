import { renderHook, act } from '@testing-library/react-hooks';
import { launchImageLibrary } from 'react-native-image-picker';
import { withTimeout } from '../../../utils/withTimeout';
import { usePickPhotoFromGallery } from '../usePickPhotoFromGallery';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));
jest.mock('../../../utils/withTimeout', () => ({
  withTimeout: jest.fn(),
}));

describe('usePickPhotoFromGallery hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return URI when a valid JPEG is selected', async () => {
    // Arrange
    (withTimeout as jest.Mock).mockImplementation(promise => promise);
    (launchImageLibrary as jest.Mock).mockResolvedValue({
      assets: [{ uri: 'file://photo.jpg', type: 'image/jpeg' }],
    });

    // Act
    const { result } = renderHook(() => usePickPhotoFromGallery());
    let uri: string | null = null;
    await act(async () => {
      uri = await result.current.pickPhoto();
    });

    // Assert
    expect(uri).toBe('file://photo.jpg');
    expect(result.current.error).toBeNull();
    expect(result.current.isPicking).toBe(false);
  });

  it('should return null when selection is cancelled', async () => {
    // Arrange
    (withTimeout as jest.Mock).mockImplementation(promise => promise);
    (launchImageLibrary as jest.Mock).mockResolvedValue({});

    // Act
    const { result } = renderHook(() => usePickPhotoFromGallery());
    let uri: string | null = null;
    await act(async () => {
      uri = await result.current.pickPhoto();
    });

    // Assert
    expect(uri).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isPicking).toBe(false);
  });

  it('should set error for unsupported formats (e.g., GIF)', async () => {
    // Arrange
    (withTimeout as jest.Mock).mockImplementation(promise => promise);
    (launchImageLibrary as jest.Mock).mockResolvedValue({
      assets: [{ uri: 'file://photo.gif', type: 'image/gif' }],
    });

    // Act
    const { result } = renderHook(() => usePickPhotoFromGallery());
    await act(async () => {
      await result.current.pickPhoto();
    });

    // Assert
    expect(result.current.error).toBe('Invalid photo format');
    expect(result.current.isPicking).toBe(false);
  });

  it('should set error when timeout occurs', async () => {
    // Arrange
    (withTimeout as jest.Mock).mockRejectedValue(new Error('Timeout occurred'));

    // Act
    const { result } = renderHook(() => usePickPhotoFromGallery());
    await act(async () => {
      await result.current.pickPhoto();
    });

    // Assert
    expect(result.current.error).toBe('Timeout occurred');
    expect(result.current.isPicking).toBe(false);
  });
});