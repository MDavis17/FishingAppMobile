import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";

export default function HomeFab() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? "close" : "plus"}
      actions={[
        {
          icon: "plus",
          label: "Option 1",
          onPress: () => {},
        },
        {
          icon: "plus",
          label: "Option 2",
          onPress: () => {},
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
