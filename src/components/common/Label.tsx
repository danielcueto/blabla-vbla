import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { fonts } from '../../theme/fonts';
import { colors } from '../../theme/colors';

interface LabelProps {
  children: React.ReactNode;
  size?: keyof typeof fonts.size;
  family?: keyof typeof fonts.family;
  color?:
    | 'electricLime'
    | 'pacificBlue'
    | 'persianBlue'
    | 'persianCyan'
    | 'desactivatedBlue'
    | 'orange'
    | 'background'
    | 'white'
    | 'error'
    | 'success';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export function Label({
  children,
  size = 'regular',
  family = 'regular',
  color = 'white',
  style,
  numberOfLines,
  ellipsizeMode,
}: LabelProps) {
  const getTextColor = (colorKey: string): string => {
    switch (colorKey) {
      case 'electricLime':
        return colors.electricLime;
      case 'pacificBlue':
        return colors.pacificBlue;
      case 'persianBlue':
        return colors.persianBlue;
      case 'persianCyan':
        return colors.persianCyan;
      case 'desactivatedBlue':
        return colors.desactivatedBlue;
      case 'orange':
        return colors.orange;
      case 'background':
        return colors.background;
      case 'white':
        return colors.white;
      case 'error':
        return colors.error;
      case 'success':
        return colors.success;
      default:
        return colors.white;
    }
  };

  const textStyle: TextStyle = {
    fontSize: fonts.size[size],
    fontFamily: fonts.family[family],
    color: getTextColor(color),
  };

  return (
    <Text
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
}