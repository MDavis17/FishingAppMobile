import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function HomeCard() {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Angler Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    height: 100,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
