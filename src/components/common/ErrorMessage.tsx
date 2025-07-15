import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Label } from '../common/Label';
import { colors } from '../../config/theme';

interface ErrorMessageProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function ErrorMessage({
  message,
  visible,
  onHide,
  duration = 4000,
}: ErrorMessageProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-100);

  const hideMessage = useCallback(() => {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(-100, { duration: 300 }, finished => {
      if (finished) {
        runOnJS(onHide)();
      }
    });
  }, [opacity, translateY, onHide]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (visible) {
      // Mostrar mensaje
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });

      // Auto-hide después del duration
      const timer = setTimeout(() => {
        hideMessage();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideMessage();
    }
  }, [visible, duration, opacity, translateY, hideMessage]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.errorMessage}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size={20}
            color={colors.pureWhite}
          />
        </View>
        <View style={styles.textContainer}>
          <Label size="small" family="semiBold" color="pureWhite">
            {message}
          </Label>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  errorMessage: {
    backgroundColor: colors.errorRed,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.errorRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
