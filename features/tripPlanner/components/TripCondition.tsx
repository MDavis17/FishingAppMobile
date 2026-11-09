import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import type { ComponentProps } from "react";
import { Text, useTheme } from "react-native-paper";

interface Props {
  label: string;
  value: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
}

export default function ForecastRow({ label, value, icon }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={theme.colors.primary}
        />
      )}
      <Text variant="bodyMedium" style={styles.rowLabel}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={styles.rowValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  rowLabel: { opacity: 0.75 },
  rowValue: { fontWeight: "600", fontSize: 16, textAlign: "center" },
});
