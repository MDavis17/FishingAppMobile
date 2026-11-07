import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";

export default function HomeFab() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? "close" : "plus"}
      actions={[
        {
          icon: "calendar-plus",
          label: "Create a Trip",
          onPress: () => navigation.navigate("NewTrip"),
        },
      ]}
      onStateChange={({ open: isOpen }) => setOpen(isOpen)}
      fabStyle={[styles.fab, { backgroundColor: theme.colors.primary }]}
      color={theme.colors.onPrimary}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    marginBottom: 16,
    marginRight: 16,
  },
});
