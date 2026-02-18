import React from "react";
import { StyleSheet, View } from "react-native";

export default function VerticalDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
});
