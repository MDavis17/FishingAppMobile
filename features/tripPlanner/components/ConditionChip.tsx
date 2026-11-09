import { TripConditionsSource } from "common/api/getTripConditions";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  source: TripConditionsSource;
}

export default function ConditionChip({ source }: Props) {
  const theme = useTheme();
  const label = source === "observed" ? "Observed" : "Forecast";
  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderColor: theme.colors.primary }]}>
        <Text style={[styles.text, { color: theme.colors.primary }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    opacity: 0.8,
  },
  text: { fontSize: 12, fontWeight: "600", opacity: 0.8 },
});
