import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";

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
    <View style={styles.slide}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button mode="contained" onPress={handleNext}>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: { fontSize: 16, textAlign: "center", marginBottom: 40 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
