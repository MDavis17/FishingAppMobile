import { TideEvent } from "common/api/getTripTides";
import {
  extremeLabel,
  formatTideTime,
} from "features/tripPlanner/utils/tideUtils";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  event: TideEvent;
  layout?: "row" | "column";
  style?: ViewStyle;
}

export default function TripTideRow({
  event,
  layout = "row",
  style,
}: Props) {
  const theme = useTheme();
  const isHigh = event.kind === "high";
  const iconColor = theme.colors.primary;

  if (layout === "column") {
    return (
      <View style={[styles.columnCell, style]}>
        <MaterialIcons
          name={isHigh ? "arrow-upward" : "arrow-downward"}
          size={22}
          color={iconColor}
        />
        <Text variant="labelSmall" style={styles.columnLabel}>
          {extremeLabel(event.kind, event.extreme)}
        </Text>
        <Text variant="bodySmall" style={styles.columnTime}>
          {formatTideTime(event.time)}
        </Text>
        <Text variant="bodySmall" style={styles.columnHeight}>
          {event.height_ft.toFixed(1)} ft
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.eventRow, style]}>
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
  columnCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 4,
    minWidth: 72,
  },
  columnLabel: { opacity: 0.75, textAlign: "center" },
  columnTime: { fontWeight: "600", textAlign: "center" },
  columnHeight: { opacity: 0.85, textAlign: "center" },
});
