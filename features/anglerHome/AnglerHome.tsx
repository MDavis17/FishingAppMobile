import ThemeSelector from "common/theme/ThemeSelector";
import React from "react";
import { View, Text } from "react-native";

export default function AnglerHome() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <ThemeSelector />
    </View>
  );
}
