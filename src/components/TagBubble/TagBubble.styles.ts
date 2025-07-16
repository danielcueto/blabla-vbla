import { StyleSheet } from 'react-native';
import { colors } from 'src/config/theme';

const styles = StyleSheet.create({
  tagBubble: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 22,
    backgroundColor: '#3A3B47',
    borderRadius: 30,
  },
  tagBubbleActive: {
    backgroundColor: colors.persianBlue,
  },
  text: {
    color: colors.pureWhite,
  },
});

export default styles;