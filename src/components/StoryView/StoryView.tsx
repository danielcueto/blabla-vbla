import { View, Image } from 'react-native';
import { useState } from 'react';
import { Label } from '../common/Label';
import styles from './StoryView.styles';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../config/theme';
import { Button } from '../common/Button';
export default function StoryView() {
  const [imageKey, setImageKey] = useState(0);

  const refreshImage = () => {
    setImageKey(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Label color="pureWhite" size="medium" family="semiBold">
          Story
        </Label>
      </View>
      <View style={styles.line}></View>
      <View style={styles.profileContainer}>
        <FontAwesome5Icon
          name="user-circle"
          solid
          size={32}
          color={colors.persianBlue}
        />
        <View>
          <Label size="small">Daniel Cueto</Label>
          <Label size="extraSmall" color="dullGray">
            Just Now
          </Label>
        </View>
      </View>
      <Label size='small'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Label>
      <Image
        source={{ uri: `https://cataas.com/cat?${imageKey}` }}
        style={styles.catImage}
        resizeMode="cover"
      />
      <Button text='Refresh' onPress={refreshImage}/>
    </View>
  );
}
