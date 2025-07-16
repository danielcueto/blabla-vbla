import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../config/theme'

export const styles = StyleSheet.create({

  screenContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },

  title: {
    fontSize: fonts.size.large,
    color: colors.pureWhite,
    fontFamily: fonts.family.bold,
    textAlign: 'center',
    marginVertical: fonts.size.small,
  },
})
