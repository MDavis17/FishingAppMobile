import PrimaryButton from "common/components/buttons/PrimaryButton";
import React from "react";
import { View, StyleSheet, Dimensions, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

interface Props {
  children: React.JSX.Element | React.JSX.Element[];
  handleNext: () => void;
  isLastSlide: boolean;
  contentStyle?: ViewStyle;
}

export default function Slide({
  children,
  handleNext,
  isLastSlide,
  contentStyle,
}: Props) {
  return (
    <View style={styles.slide}>
      <View style={contentStyle}>{children}</View>
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={handleNext}>
          {isLastSlide ? "Get Started" : "Next"}
        </PrimaryButton>
      </View>
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
  buttonContainer: { paddingTop: 16 },
});
