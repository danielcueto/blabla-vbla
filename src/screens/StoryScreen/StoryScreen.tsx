import { SafeAreaView } from "react-native-safe-area-context";
import StoryView from "../../components/StoryView/StoryView";
import styles from "./StorryScreen.styles";
export default function StoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StoryView />
    </SafeAreaView>
  ); 
}
