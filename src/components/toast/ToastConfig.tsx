import { StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Label } from '../common/Label';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
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
    backgroundColor: colors.success,
  },
  successIconContainer: {
    backgroundColor: '#00620B',
  },
  errorColors: {
    backgroundColor: colors.error,
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

const toastConfig = {
  success: (props: any) => (
    <View style={[styles.baseToast, styles.successColors]}>
      <View style={[styles.iconContainer, styles.successIconContainer]}>
        <FontAwesomeIcon icon={faCheck} size={20} color={colors.white} />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="background">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="xsmall" family="regular" color="background">
            {props.text2}
          </Label>
        )}
      </View>
    </View>
  ),

  error: (props: any) => (
    <View style={[styles.baseToast, styles.errorColors]}>
      <View style={[styles.iconContainer, styles.errorIconContainer]}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size={20}
          color={colors.white}
        />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="white">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="xsmall" family="regular" color="white">
            {props.text2}
          </Label>
        )}
      </View>
    </View>
  ),

  info: (props: any) => (
    <View style={[styles.baseToast, styles.infoColors]}>
      <View style={[styles.iconContainer, styles.infoIconContainer]}>
        <FontAwesomeIcon icon={faInfoCircle} size={20} color={colors.white} />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="white">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="xsmall" family="regular" color="white">
            {props.text2}
          </Label>
        )}
      </View>
    </View>
  ),
};

export { toastConfig };
