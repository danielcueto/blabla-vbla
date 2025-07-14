import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Label } from '../common/Label';
import { colors } from '../../config/theme';
import { styles } from './ToastConfig.styles';

const toastConfig = {
  success: (props: any) => (
    <View style={[styles.baseToast, styles.successColors]}>
      <View style={[styles.iconContainer, styles.successIconContainer]}>
        <FontAwesomeIcon icon={faCheck} size={20} color={colors.pureWhite} />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="backgroundDark">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="extraSmall" family="regular" color="backgroundDark">
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
          color={colors.pureWhite}
        />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="pureWhite">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="extraLarge" family="regular" color="pureWhite">
            {props.text2}
          </Label>
        )}
      </View>
    </View>
  ),

  info: (props: any) => (
    <View style={[styles.baseToast, styles.infoColors]}>
      <View style={[styles.iconContainer, styles.infoIconContainer]}>
        <FontAwesomeIcon icon={faInfoCircle} size={20} color={colors.pureWhite} />
      </View>
      <View style={styles.baseContainer}>
        <Label size="small" family="semiBold" color="pureWhite">
          {props.text1}
        </Label>
        {props.text2 && (
          <Label size="extraSmall" family="regular" color="pureWhite">
            {props.text2}
          </Label>
        )}
      </View>
    </View>
  ),
};

export { toastConfig };
