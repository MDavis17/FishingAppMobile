
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  children: React.ReactNode;
}

export default function Card({children}: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});
