import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableOpacityProps,
} from 'react-native';
import { Label } from './Label';
import { colors } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({
  text,
  fullWidth = false,
  isLoading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.buttonFullWidth,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      <Label
        size={isTablet ? 'regular' : 'small'}
        family="semiBold"
        color={variant === 'secondary' ? 'pacificBlue' : 'white'}
        style={styles.buttonText}
      >
        {isLoading ? 'Loading...' : text}
      </Label>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    backgroundColor: colors.pacificBlue,
    borderRadius: isTablet ? 30 : 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: colors.pacificBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonFullWidth: {
    width: screenWidth - 120,
  },
  buttonPrimary: {
    backgroundColor: colors.pacificBlue,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.pacificBlue,
  },
  buttonDisabled: {
    backgroundColor: colors.desactivatedBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    textAlign: 'center',
  },
});
