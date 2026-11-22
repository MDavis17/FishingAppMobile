import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface Props {
  isSaved: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default function SaveLocationButton({
  isSaved,
  disabled,
  onPress,
}: Props) {
  const theme = useTheme();

  if (isSaved) {
    return (
      <Button
        mode="contained"
        compact
        icon="bookmark"
        onPress={onPress}
        disabled={disabled}
        textColor={theme.colors.primary}
        buttonColor={theme.colors.surface}
        style={styles.button}
        labelStyle={styles.label}
        contentStyle={styles.content}
      >
        Saved
      </Button>
    );
  }

  return (
    <Button
      mode="outlined"
      compact
      icon="bookmark-outline"
      onPress={onPress}
      disabled={disabled}
      textColor={theme.colors.onSurface}
      style={styles.button}
      labelStyle={styles.label}
      contentStyle={styles.content}
    >
      Save Location
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignSelf: "flex-start",
    flexGrow: 0,
    flexShrink: 0,
  },
  label: {
    marginHorizontal: 6,
    marginVertical: 0,
    fontSize: 13,
    lineHeight: 16,
  },
  content: {
    height: 32,
    paddingHorizontal: 2,
  },
});