import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { showCustomToast } from '../components/toast/CustomToast';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Label from '../components/common/Label';

import HeadLoginSvg from '../../assets/svg/head_login.svg';
import OrnamentLoginSvg from '../../assets/svg/ornament_login.svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;

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

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleEmailChange = (text: string) => {
    const sanitizedEmail = sanitizeInput(text);
    setEmail(sanitizedEmail);

    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      setErrors(prev => ({ ...prev, email: 'Enter a valid main address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (text: string) => {
    const sanitizedPassword = sanitizeInput(text);
    setPassword(sanitizedPassword);

    if (sanitizedPassword && sanitizedPassword.length < 5) {
      setErrors(prev => ({
        ...prev,
        password: 'Password no',
      }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showCustomToast({
        type: 'error',
        message: 'Campos requeridos',
        description: 'Por favor completa todos los campos',
      });
      return;
    }

    if (!validateEmail(email)) {
      showCustomToast({
        type: 'error',
        message: 'Email inválido',
        description: 'Por favor ingresa un email válido',
      });
      return;
    }

    if (password.length < 6) {
      showCustomToast({
        type: 'error',
        message: 'Contraseña muy corta',
        description: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (email === 'admin@example.com' && password === 'password123') {
        showCustomToast({
          type: 'success',
          message: 'Login Successful',
        });
      } else {
        showCustomToast({
          type: 'error',
          message: 'Error attempt login',
        });
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header SVG - Top of screen */}
      <View style={styles.headerSvgContainer}>
        <HeadLoginSvg width="100%" height={100} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Image
            source={require('../../assets/images/AssuresoftLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Label 
            size={isTablet ? "xlarge" : isSmallScreen ? "medium" : "large"}
            family="bold"
            color="white"
            style={styles.title}
          >
            Snaps
          </Label>

          <View style={styles.inputContainer}>
            <Label 
              size={isTablet ? "regular" : "small"}
              family="semiBold"
              color="white"
              style={styles.label}
            >
              Email
            </Label>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="name@assuresoft.com"
                placeholderTextColor={colors.desactivatedBlue}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                maxLength={100}
              />
            </View>
            {errors.email ? (
              <Label 
                size={isTablet ? "small" : "xsmall"}
                family="regular"
                color="error"
                style={styles.errorText}
              >
                {errors.email}
              </Label>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Label 
              size={isTablet ? "regular" : "small"}
              family="semiBold"
              color="white"
              style={styles.label}
            >
              Password
            </Label>
            <View style={styles.inputWrapper}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="password"
                  placeholderTextColor={colors.desactivatedBlue}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  maxLength={50}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    size={18}
                    color={colors.desactivatedBlue}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {errors.password ? (
              <Label 
                size={isTablet ? "small" : "xsmall"}
                family="regular"
                color="error"
                style={styles.errorText}
              >
                {errors.password}
              </Label>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isLoading || errors.email || errors.password) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !!errors.email || !!errors.password}
            activeOpacity={0.8}
          >
            <Label 
              size={isTablet ? "regular" : "small"}
              family="semiBold"
              color="white"
              style={styles.submitButtonText}
            >
              {isLoading ? 'Login...' : 'Login'}
            </Label>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.ornamentSvgContainer}>
        <OrnamentLoginSvg width={150} height={150} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSvgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  ornamentSvgContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: isTablet ? screenWidth * 0.15 : isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 20 : 40,
    minHeight: screenHeight,
    paddingTop: 120, 
  },
  formContainer: {
    padding: isTablet ? 32 : isSmallScreen ? 16 : 24,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: isTablet ? 500 : '100%',
    width: '100%',
  },
  logo: {
    width: isTablet ? 160 : isSmallScreen ? 100 : 120,
    height: isTablet ? 80 : isSmallScreen ? 50 : 60,
    alignSelf: 'center',
    marginBottom: isTablet ? 32 : isSmallScreen ? 16 : 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: isTablet ? 40 : isSmallScreen ? 24 : 32,
  },
  inputContainer: {
    marginBottom: isTablet ? 24 : isSmallScreen ? 16 : 20,
  },
  inputWrapper: {
    marginRight: -(isTablet ? screenWidth * 0.15 : isSmallScreen ? 16 : 24), // Extend to screen edge
  },
  label: {
    marginBottom: isSmallScreen ? 6 : 8,
  },
  input: {
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    borderWidth: 1,
    borderColor: colors.desactivatedBlue,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: isTablet ? 20 : 16,
    fontSize: isTablet ? fonts.size.regular : fonts.size.small,
    fontFamily: fonts.family.regular,
    backgroundColor: colors.white,
    color: colors.background,
    marginRight: 0,
    borderRightWidth: 0, // Remove right border to extend to edge
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fff5f5',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    borderWidth: 1,
    borderColor: colors.desactivatedBlue,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingRight: isTablet ? 60 : 50,
    fontSize: isTablet ? fonts.size.regular : fonts.size.small,
    fontFamily: fonts.family.regular,
    backgroundColor: colors.white,
    color: colors.background,
    marginRight: 0,
    borderRightWidth: 0, // Remove right border to connect with eye button
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: isTablet ? 60 : 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.desactivatedBlue,
    borderTopRightRadius: 0, // Square right edge to reach screen border
    borderBottomRightRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0, // No right border to extend to edge
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    backgroundColor: colors.pacificBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isTablet ? 16 : 8,
    elevation: 2,
    shadowColor: colors.pacificBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginRight: 0,
  },
  submitButtonDisabled: {
    backgroundColor: colors.desactivatedBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
  
  },
});
