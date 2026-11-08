import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CatchStat } from "types";

function formatStat(stat: CatchStat): { label: string; value: string } {
  switch (stat.type) {
    case "totalCaught":
      return { label: "Total Caught", value: String(stat.value) };
    case "targetAchieved":
      return { label: "Target Species", value: stat.value ? "Yes" : "No" };
    case "largestCatch":
      return { label: "Largest", value: `${stat.value} in` };
    default:
      return { label: stat.type, value: String(stat.value) };
  }
}

interface Props {
  stat: CatchStat;
}

export default function CatchStatPill({ stat }: Props) {
  const theme = useTheme();
  const { label, value } = formatStat(stat);

  return (
    <View
      style={[styles.pill, { backgroundColor: theme.colors.surfaceVariant }]}
    >
      <Text
        variant="labelSmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
      <Text variant="titleSmall" style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  value: {
    fontWeight: "600",
    marginTop: 2,
  },
});
