import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  styleOveride?: StyleProp<ViewStyle>;
}

export default function Divider({ styleOveride }: Props) {
  return <View style={[styles.divider, styleOveride]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
