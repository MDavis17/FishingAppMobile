import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  title: string;
  description: string;
  handleNext: () => void;
  isLastSlide: boolean;
}

export default function Slide({
  title,
  description,
  handleNext,
  isLastSlide,
}: Props) {
  return (
    <View style={styles.slide}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#007aff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
