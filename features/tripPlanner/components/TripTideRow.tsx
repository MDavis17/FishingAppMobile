import { TideEvent } from "common/api/getTripTides";
import {
  extremeLabel,
  formatTideTime,
} from "features/tripPlanner/utils/tideUtils";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  event: TideEvent;
}

export default function TripTideRow({ event }: Props) {
  const isHigh = event.kind === "high";
  return (
    <View key={`${event.time}-${event.kind}`} style={styles.eventRow}>
      <MaterialIcons
        name={isHigh ? "arrow-upward" : "arrow-downward"}
        size={24}
        color="black"
      />
      <Text variant="bodyMedium" style={styles.eventLabel}>
        {extremeLabel(event.kind, event.extreme)}
      </Text>
      <Text variant="bodyMedium" style={styles.eventTime}>
        {formatTideTime(event.time)}
      </Text>
      <Text variant="bodyMedium" style={styles.eventHeight}>
        {event.height_ft.toFixed(1)} ft
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  eventTime: { flex: 1, textAlign: "center" },
  eventLabel: { flex: 1, opacity: 0.85 },
  eventHeight: { flex: 1, textAlign: "right" },
});
