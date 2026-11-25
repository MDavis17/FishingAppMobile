import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

interface Props {
  icon?: string;
  leading?: ReactNode;
  label?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
}

export default function PreviewStatsItem({
  icon,
  leading,
  label,
  accessibilityLabel,
  children,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      accessible={accessibilityLabel != null}
    >
      {leading ??
        (icon != null ? (
          <Icon source={icon} size={24} color={theme.colors.primary} />
        ) : null)}
      {children ?? (label != null ? <Text variant="bodyMedium">{label}</Text> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});