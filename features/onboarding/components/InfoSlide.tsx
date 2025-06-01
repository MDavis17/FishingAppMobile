import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import Slide from "./Slide";

const { width } = Dimensions.get("window");

interface Props {
  title: string;
  description: string;
  handleNext: () => void;
  isLastSlide: boolean;
}

export default function InfoSlide({
  title,
  description,
  handleNext,
  isLastSlide,
}: Props) {
  return (
    <Slide handleNext={handleNext} isLastSlide={isLastSlide}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: { fontSize: 16, textAlign: "center" },
});
