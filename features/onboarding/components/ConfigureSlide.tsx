import ThemeSelector from "common/theme/ThemeSelector";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button, useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

interface Props {
  handleNext: () => void;
  isLastSlide: boolean;
}

export default function ConfigureSlide({ handleNext, isLastSlide }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.slide}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Choose your Theme
      </Text>
      <ThemeSelector />
      <Button mode="contained" onPress={handleNext} style={{ marginTop: 10 }}>
        {isLastSlide ? "Get Started" : "Next"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
