import { StyleSheet } from 'react-native'
import { colors, fonts, spacing, borderRadius } from '../../config/theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: colors.errorRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginTop: spacing.small,
    fontSize: fonts.size.small,
    color: colors.pureWhite,
    textAlign: 'center',
    fontFamily: fonts.family.regular,
  },

  noCameraContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCameraText: {
    fontSize: fonts.size.medium,
    color: colors.pureWhite,
    paddingHorizontal: spacing.medium,
    textAlign: 'center',
    fontFamily: fonts.family.regular,
  },
  handleCapture:{
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.warningOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraFill: {
    ...StyleSheet.absoluteFillObject,
  },

  loadingIndicator: {
    position: 'absolute',
    zIndex: 1,
  },

  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.backgroundDark,
    padding: spacing.large,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.pureWhite,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledButton: {
    backgroundColor: `${colors.warningOrange}80`, 
  },

  previewContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },

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
    fontSize: fonts.size.small,
    color: colors.pureWhite,
    fontFamily: fonts.family.regular,
  },
})
