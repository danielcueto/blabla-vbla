import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { fonts } from '../../theme/fonts';
import { colors } from '../../theme/colors';

interface LabelProps {
  children: React.ReactNode;
  size?: keyof typeof fonts.size;
  family?: keyof typeof fonts.family;
  color?: keyof typeof colors;
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
    const colorChoosen = colors[colorKey as keyof typeof colors];
    if (colorChoosen) {
      return colorChoosen;
    } else {
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
