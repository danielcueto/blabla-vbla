import { Dimensions, StyleSheet } from 'react-native'
import { colors } from '../../config/theme'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const isSmallScreen = screenWidth < 380
const isTablet = screenWidth > 768

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  inner: {
    flex: 1,
  },
  headerSvgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  ornamentSvgContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 60 : isSmallScreen ? 20 : 24,
    paddingVertical: 40,
    zIndex: 1,
    minHeight: screenHeight * 0.6,
  },
  formContainer: {
    width: '100%',
    maxWidth: isTablet ? 400 : screenWidth,
    alignItems: 'center',
  },
  logo: {
    width: isTablet ? 160 : isSmallScreen ? 100 : 120,
    height: isTablet ? 80 : isSmallScreen ? 50 : 60,
    marginBottom: isTablet ? 32 : isSmallScreen ? 16 : 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: isTablet ? 40 : isSmallScreen ? 24 : 32,
  },
  submitButton: {
    marginTop: isTablet ? 16 : 8,
  },
  testButton: {
    marginTop: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
