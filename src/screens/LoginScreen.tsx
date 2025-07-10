import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,

} from 'react-native';
import { showCustomToast } from '../components/toast/CustomToast';
import { colors } from '../theme/colors';
import { Label } from '../components/common/Label';
import { Input } from '../components/common/Input';

import HeadLoginSvg from '../../assets/svg/head_login.svg';
import OrnamentLoginSvg from '../../assets/svg/ornament_login.svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isTablet = screenWidth > 768;
const isLandscape = screenWidth > screenHeight;


export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      showCustomToast({
        type: 'error',
        message: 'Campos requeridos',
        description: 'Por favor completa todos los campos',
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

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Label
              size={isTablet ? 'regular' : 'small'}
              family="semiBold"
              color="white"
              style={styles.submitButtonText}
            >
              {isLoading ? 'Login...' : 'Login'}
            </Label>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ornamentSvgContainer}>
        <OrnamentLoginSvg
          width={isTablet ? 140 : isSmallScreen ? 80 : 100}
          height={isTablet ? 140 : isSmallScreen ? 80 : 100}
        />
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
    width: '100%',
    height: isTablet ? 56 : isSmallScreen ? 44 : 50,
    backgroundColor: colors.pacificBlue,
    borderRadius: isTablet ? 30 : 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isTablet ? 16 : 8,
    elevation: 2,
    shadowColor: colors.pacificBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: colors.desactivatedBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    textAlign: 'center',
  },
});
