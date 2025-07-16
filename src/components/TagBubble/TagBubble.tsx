import React, { JSX, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { TagBubbleProps } from '../../interfaces/components/TagBubbleProps';
import styles from './TagBubble.styles';
import { fonts } from 'src/config/theme';

export default function TagBubble({
  tag,
  containerStyle,
  onPress,
}: TagBubbleProps): JSX.Element {
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    setIsSelected(!isSelected);
    onPress?.(tag.id);
  };

  return (
    <Pressable
      accessibilityRole="button"
      testID="tag-pressable"
      style={[
        styles.tagBubble,
        isSelected && styles.tagBubbleActive,
        containerStyle,
      ]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.text,
          { fontSize: fonts.size.medium },
          { fontFamily: fonts.family.bold }
        ]}
      >
        {tag.name}
      </Text>
    </Pressable>
  );
}