import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardTypeOptions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../config/theme';
import { fonts } from '../../config/theme';
import { Label } from './Label';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;

export type InputType = 'text' | 'email' | 'password';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: InputType;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoComplete?: 'email' | 'password' | 'username' | 'off' | undefined;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

const getValidationError = (value: string, type: InputType): string => {
  if (!value) return '';

  switch (type) {
    case 'email':
      return !validateEmail(value) ? 'Enter a valid email address' : '';
    case 'password':
      return value.length < 3 ? 'wrong password format' : '';
    default:
      return '';
  }
};

const getKeyboardType = (type: InputType): KeyboardTypeOptions => {
  switch (type) {
    case 'email':
      return 'email-address';
    default:
      return 'default';
  }
};

export function Input({
  label,
  value,
  onChangeText,
  type = 'text',
  placeholder,
  error,
  maxLength = 100,
  autoCapitalize = type === 'email' ? 'none' : 'sentences',
  autoCorrect = type === 'email' ? false : true,
  autoComplete,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState('');

  const handleTextChange = (text: string) => {
    const sanitizedText = sanitizeInput(text);
    onChangeText(sanitizedText);

    const validationError = getValidationError(sanitizedText, type);
    setInternalError(validationError);
  };

  const displayError = error || internalError;
  const isPassword = type === 'password';

  return (
    <View style={styles.inputContainer}>
      <Label
        size={isTablet ? 'regular' : 'small'}
        family="semiBold"
        color="pureWhite"
        style={[styles.label, displayError ? { color: colors.errorRed } : null]}
      >
        {label}
      </Label>
      <View style={styles.inputWrapper}>
        {isPassword ? (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                displayError ? styles.inputError : null,
              ]}
              placeholder={placeholder}
              placeholderTextColor={colors.deactivatedBlue}
              value={value}
              onChangeText={handleTextChange}
              secureTextEntry={!showPassword}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              autoComplete={autoComplete}
              maxLength={maxLength}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                size={isTablet ? 22 : 18}
                color={colors.deactivatedBlue}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={[styles.input, displayError ? styles.inputError : null]}
            placeholder={placeholder}
            placeholderTextColor={colors.deactivatedBlue}
            value={value}
            onChangeText={handleTextChange}
            keyboardType={getKeyboardType(type)}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoComplete={autoComplete}
            maxLength={maxLength}
          />
        )}
      </View>
      {displayError ? (
        <Label
          size={isTablet ? 'small' : 'extraSmall'}
          family="regular"
          color="errorRed"
          style={styles.errorText}
        >
          {displayError}
        </Label>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: isTablet ? 24 : isSmallScreen ? 16 : 20,
  },
  inputWrapper: {
    marginRight: -(isTablet ? 60 : isSmallScreen ? 20 : 24),
  },
  label: {
    marginBottom: isSmallScreen ? 6 : 8,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    width: '100%',
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: isTablet ? 20 : 16,
    fontSize: isTablet ? fonts.size.regular : fonts.size.small,
    fontFamily: fonts.family.regular,
    backgroundColor: colors.pureWhite,
    color: colors.backgroundDark,
  },
  inputError: {
    borderWidth: 3,
    borderColor: colors.errorRed,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingRight: isTablet ? 60 : 50,
    fontSize: isTablet ? fonts.size.regular : fonts.size.small,
    fontFamily: fonts.family.regular,
    backgroundColor: colors.pureWhite,
    color: colors.backgroundDark,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: isTablet ? 60 : 50,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    textAlign: 'left',
    width: '100%',
  },
});
