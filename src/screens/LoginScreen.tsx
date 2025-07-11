import { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { showCustomToast } from '../components/toast/CustomToast';
import { colors } from '../theme/colors';
import { Label } from '../components/common/Label';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { authService } from '../services/AuthService';
import { LoginResponse } from '../services/ApiService';

import HeadLoginSvg from '../../assets/svg/head_login.svg';
import OrnamentLoginSvg from '../../assets/svg/ornament_login.svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;
const isLandscape = screenWidth > screenHeight;

const getKeyboardOffset = () => {
  if (Platform.OS === 'ios') return 0;
  
  if (isTablet) return -60;
  if (isSmallScreen) return -40;
  return -40;
};

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      showCustomToast({
        type: 'error',
        message: 'Please, complete all fields',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response: LoginResponse = await authService.login(email, password);
      showCustomToast({
        type: 'success',
        message: 'Login Successful',
      });

      // Aquí puedes navegar a la siguiente pantalla
      // navigation.navigate('HomeCamera');
      // usando response.isFirstLogin
    } catch (error: any) {
      console.log(error);
      setErrorMessage("We found some errores. Please review the fields and make corrections");
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={getKeyboardOffset()}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <ErrorMessage
            message={errorMessage}
            visible={showErrorMessage}
            onHide={() => setShowErrorMessage(false)}
          />

          {!isLandscape && (
            <View style={styles.headerSvgContainer}>
              <HeadLoginSvg
                width={screenWidth}
                height={isTablet ? screenHeight * 0.25 : screenHeight * 0.2}
              />
            </View>
          )}

          <View style={styles.mainContent}>
            <View style={styles.formContainer}>
              <Image
                source={require('../../assets/images/AssuresoftLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Label
                size={isTablet ? 'xlarge' : isSmallScreen ? 'medium' : 'large'}
                family="bold"
                color="white"
                style={styles.title}
              >
                Snaps
              </Label>

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                type="email"
                placeholder="name@assuresoft.com"
                maxLength={100}
                autoComplete="email"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                type="password"
                placeholder="password"
                maxLength={50}
                autoComplete="password"
              />

              <Button
                text={isLoading ? 'Login...' : 'Login'}
                fullWidth={true}
                isLoading={isLoading}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </View>
          </View>

          <View style={styles.ornamentSvgContainer}>
            <OrnamentLoginSvg
              width={isTablet ? 140 : isSmallScreen ? 80 : 100}
              height={isTablet ? 140 : isSmallScreen ? 80 : 100}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    height: isLandscape ? screenHeight * 0.9 : undefined,
    minHeight: isLandscape ? screenHeight * 0.8 : screenHeight * 0.6,
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
});
