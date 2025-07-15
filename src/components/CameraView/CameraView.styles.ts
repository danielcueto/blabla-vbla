import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../config/theme';
import { EDGE_BUTTON_SIZE } from '../../config/config';

/**
 * CameraView Styles
 *
 * Maintains a responsive layout for camera and gallery controls,
 * and provides utilities for photo preview and permission states.
 */
export const styles = StyleSheet.create({
  /**
   * Fullscreen container background.
   */
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },

  /**
   * Overlay when requesting camera permission.
   */
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.errorRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginTop: spacing.small,
    fontSize: spacing.small,
    color: colors.pureWhite,
    textAlign: 'center',
    fontFamily: 'System',
  },

  /**
   * Fallback view when camera unavailable.
   */
  noCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
  },
  noCameraText: {
    fontSize: spacing.medium,
    color: colors.pureWhite,
    textAlign: 'center',
    paddingHorizontal: spacing.medium,
    fontFamily: 'System',
  },

  /**
   * Expands camera view to fill screen.
   */
  cameraFill: {
    ...StyleSheet.absoluteFillObject,
  },

  /**
   * Loading indicator overlay.
   */
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1,
  },

  /**
   * Bottom controls container: gallery | shutter | placeholder.
   */
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },

  /**
   * Center shutter button.
   */
  captureButton: {
    alignSelf: 'center',
    backgroundColor: colors.backgroundDark,
    padding: spacing.large,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.pureWhite,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  /**
   * Edge buttons for gallery and placeholder.
   */
  edgeButton: {
    width: EDGE_BUTTON_SIZE,
    height: EDGE_BUTTON_SIZE,
    borderRadius: EDGE_BUTTON_SIZE / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },

  /**
   * Photo preview container and image.
   */
  previewContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  previewPhoto: {
    width: '100%',
    height: '100%',
  },

  /**
   * Retake button overlay on preview.
   */
  retakeButton: {
    position: 'absolute',
    backgroundColor: colors.deactivatedBlue,
    padding: spacing.small,
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeText: {
    marginLeft: spacing.small,
    fontSize: spacing.small,
    color: colors.pureWhite,
    fontFamily: 'System',
  },
});