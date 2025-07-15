import { StyleSheet } from 'react-native';
import { colors } from '../../config/theme';

export const styles = StyleSheet.create({
  baseToast: {
    borderRadius: 25,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 0,
    borderLeftWidth: 0,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  successColors: {
    backgroundColor: colors.successGreen,
  },
  successIconContainer: {
    backgroundColor: '#00620B',
  },
  errorColors: {
    backgroundColor: colors.errorRed,
  },
  errorIconContainer: {
    backgroundColor: '#611000',
  },
  infoColors: {
    backgroundColor: colors.pacificBlue,
  },
  infoIconContainer: {
    backgroundColor: colors.pacificBlue,
  },
});
