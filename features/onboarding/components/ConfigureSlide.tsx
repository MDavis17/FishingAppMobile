import ThemeSelector from "common/theme/ThemeSelector";
import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import Slide from "./Slide";

const { width } = Dimensions.get("window");

interface Props {
  handleNext: () => void;
  isLastSlide: boolean;
}

export default function ConfigureSlide({ handleNext, isLastSlide }: Props) {
  const theme = useTheme();

  return (
    <Slide handleNext={handleNext} isLastSlide={isLastSlide}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Choose your Theme
      </Text>
      <ThemeSelector />
    </Slide>
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
