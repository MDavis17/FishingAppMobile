import { SolunarPeriod } from "common/api/getTripSolunar";
import { formatSolunarWindow } from "features/tripPlanner/utils/tideUtils";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  period: SolunarPeriod;
}

function periodLabel(kind: SolunarPeriod["kind"]): string {
  return kind === "major" ? "Major" : "Minor";
}

export default function TripSolunarRow({ period }: Props) {
  return (
    <View style={styles.periodRow}>
      <Text variant="bodyMedium" style={styles.periodLabel}>
        {periodLabel(period.kind)}
      </Text>
      <Text variant="bodyMedium" style={styles.periodTime}>
        {formatSolunarWindow(period.start, period.end)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  periodLabel: { flex: 1, opacity: 0.85 },
  periodTime: { flex: 2, textAlign: "right" },
});
