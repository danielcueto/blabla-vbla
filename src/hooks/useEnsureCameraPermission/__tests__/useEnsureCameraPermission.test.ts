import { renderHook, act } from '@testing-library/react-hooks'
import useEnsureCameraPermission from '../useEnsureCameraPermission'
import { useCameraPermission } from 'react-native-vision-camera'

jest.mock('react-native-vision-camera', () => ({
  __esModule: true,
  useCameraPermission: jest.fn(),
}))

describe('useEnsureCameraPermission hook', () => {
  const mockUseCameraPermission = useCameraPermission as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should mark checked and granted when permission is already true', async () => {
    const mockRequest = jest.fn()
    mockUseCameraPermission.mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequest,
    })

    const { result } = renderHook(() => useEnsureCameraPermission())

    await act(async () => {})

    expect(mockRequest).not.toHaveBeenCalled()
    expect(result.current.isPermissionChecked).toBe(true)
    expect(result.current.isPermissionGranted).toBe(true)
  })

  it('should request permission when missing, then mark checked and granted', async () => {
    const mockRequest = jest.fn().mockResolvedValue(undefined)
    mockUseCameraPermission
      .mockReturnValueOnce({
        hasPermission: false,
        requestPermission: mockRequest,
      })
      .mockReturnValueOnce({
        hasPermission: true,
        requestPermission: mockRequest,
      })

    const { result } = renderHook(() => useEnsureCameraPermission())

    await act(async () => {})

    expect(mockRequest).toHaveBeenCalled()
    expect(result.current.isPermissionChecked).toBe(true)
    expect(result.current.isPermissionGranted).toBe(true)
  })

  it('should mark checked even if requestPermission fails and remain not granted', async () => {
    const mockRequest = jest.fn().mockRejectedValue(new Error('denied'))
    mockUseCameraPermission
      .mockReturnValueOnce({
        hasPermission: false,
        requestPermission: mockRequest,
      })
      .mockReturnValueOnce({
        hasPermission: false,
        requestPermission: mockRequest,
      })

    const { result } = renderHook(() => useEnsureCameraPermission())

    await act(async () => {})

    expect(mockRequest).toHaveBeenCalled()
    expect(result.current.isPermissionChecked).toBe(true)
    expect(result.current.isPermissionGranted).toBe(false)
  })
})
