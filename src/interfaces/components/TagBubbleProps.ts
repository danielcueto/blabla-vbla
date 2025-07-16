import { ViewStyle } from 'react-native';
import { Tag } from '../../types/Tag';

export interface TagBubbleProps {
  tag: Tag;
  containerStyle?: ViewStyle;
  onPress?: (tagId: string) => void;
}