import { SolunarPeriod } from "common/api/getTripSolunar";
import { formatSolunarWindow } from "features/tripPlanner/utils/tideUtils";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  period: SolunarPeriod;
}

function periodLabel(kind: SolunarPeriod["kind"]): string {
  return kind === "major" ? "Major" : "Minor";
}

export default function TripSolunarRow({ period }: Props) {
  const theme = useTheme();
  const isMajor = period.kind === "major";
  const chipBg = isMajor ? theme.colors.primary : theme.colors.secondary;
  const chipTextColor = isMajor
    ? theme.colors.onPrimary
    : theme.colors.onSecondary;

  return (
    <View style={styles.periodRow}>
      <View style={[styles.chip, { backgroundColor: chipBg }]}>
        <Text
          variant="labelSmall"
          style={[styles.chipText, { color: chipTextColor }]}
        >
          {periodLabel(period.kind)}
        </Text>
      </View>
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
    gap: 8,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    fontWeight: "600",
  },
  periodTime: {
    flexShrink: 1,
    fontSize: 13,
  },
});
