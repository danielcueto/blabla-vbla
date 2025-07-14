import { StyleSheet } from 'react-native'
import { colors, fonts, spacing, borderRadius } from '../../config/theme'

export const styles = StyleSheet.create({
  baseToast: {
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.medium,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 5,
    shadowRadius: 8,
    borderWidth: 1,
    minHeight: 70,
  },
  baseContainer: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
  },
  primaryText: {
    fontSize: fonts.size.regular,
    fontFamily: fonts.family.semiBold,
    marginBottom: spacing.extraSmall,
  },
  successStyle: {
    borderLeftColor: colors.successGreen,
    backgroundColor: `${colors.successGreen}20`,
    borderColor: colors.successGreen,
  },
  errorStyle: {
    borderLeftColor: colors.errorRed,
    backgroundColor: `${colors.errorRed}20`,
    borderColor: colors.errorRed,
  },
  infoStyle: {
    borderLeftColor: colors.persianBlue,
    backgroundColor: `${colors.pacificBlue}20`,
    borderColor: colors.persianBlue,
  },
  successText: {
    color: colors.successGreen,
  },
  errorText: {
    color: colors.errorRed,
  },
  infoText: {
    color: colors.persianBlue,
  },
})
