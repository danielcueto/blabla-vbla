import { useState, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { showCustomToast } from '../../components/toast/CustomToast';
import { Label } from '../../components/common/Label';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { styles } from './LoginScreen.styles';
import { useNavigation } from '@react-navigation/native';
import HeadLoginSvg from '../../../assets/svg/head_login.svg';
import OrnamentLoginSvg from '../../../assets/svg/ornament_login.svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;

const getKeyboardOffset = () => {
  if (Platform.OS === 'ios') return 0;

  if (isTablet) return -60;
  if (isSmallScreen) return -40;
  return -40;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { isAuthenticated, isLoading, login } = useAuth();

  /**
   * Effect that checks if user is already authenticated
   * If authenticated, automatically redirects to home screen
   * This prevents authenticated users from seeing the login screen
   */
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      (navigation as any).navigate('Home');
    }
  }, [isAuthenticated, isLoading, navigation]);

  /**
   * If still checking authentication status, show loading state
   * This prevents flash of login screen for authenticated users
   */
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Label color="pureWhite" size="large">Loading...</Label>
      </View>
    );
  }
  const handleSubmit = async () => {
    if (!email || !password) {
      showCustomToast({
        type: 'error',
        message: 'Please, complete all fields',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      showCustomToast({
        type: 'success',
        message: 'Login Successful',
      });
      // Navigation will be handled automatically by useEffect when isAuthenticated changes
      // No need to manually navigate here as the auth context will update
    } catch (error: any) {
      console.log(error);
      setErrorMessage(
        'We found some errors. Please review the fields and make corrections',
      );
      setShowErrorMessage(true);
    } finally {
      setIsSubmitting(false);
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

          <View style={styles.headerSvgContainer}>
            <HeadLoginSvg
              width={screenWidth}
              height={isTablet ? screenHeight * 0.25 : screenHeight * 0.2}
            />
          </View>

          <View style={styles.mainContent}>
            <View style={styles.formContainer}>
              <Image
                source={require('../../../assets/images/AssuresoftLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Label
                size={
                  isTablet ? 'extraLarge' : isSmallScreen ? 'medium' : 'large'
                }
                family="bold"
                color="pureWhite"
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
                text={isSubmitting ? 'Login...' : 'Login'}
                fullWidth={true}
                isLoading={isSubmitting}
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
