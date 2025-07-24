import { StyleSheet } from "react-native";
import { colors } from "../../config/theme";

const styles = StyleSheet.create({
  container: {
    padding: 28,
    paddingTop: 0,
  },
  headContainer: {
    marginBottom: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  line: {
    backgroundColor: colors.electricLime,
    width: '90%',
    height: 1.5,
    alignSelf: 'center',
    marginBottom: 30,
  },
  catImage: {
    width: '100%',
    aspectRatio: 9/16,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 15,
  }
})

export default styles;

