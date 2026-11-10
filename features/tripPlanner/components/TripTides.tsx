import ConditionChip from "features/tripPlanner/components/ConditionChip";
import { TripTidesData } from "common/api/getTripTides";
import { TripTidesStatus } from "features/tripPlanner/hooks/useTripConditions";
import { parse } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  tides: TripTidesData | null;
  tidesStatus: TripTidesStatus;
}

function formatTideTime(noaaTime: string): string {
  try {
    const parsed = parse(noaaTime, "yyyy-MM-dd HH:mm", new Date());
    return parsed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return noaaTime;
  }
}

function extremeLabel(kind: "high" | "low", extreme: "major" | "minor"): string {
  const level = extreme === "major" ? "Major" : "Minor";
  const tide = kind === "high" ? "High" : "Low";
  return `${level} ${tide}`;
}

export default function TripTides({ tides, tidesStatus }: Props) {
  if (tidesStatus === "error") {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Tides
        </Text>
        <Text variant="bodySmall" style={styles.message}>
          Couldn&apos;t load tides.
        </Text>
      </View>
    );
  }

  if (!tides) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>
          Tides
        </Text>
        <ConditionChip source={tides.source} />
      </View>
      <Text variant="bodySmall" style={styles.station}>
        {tides.station_name} · {tides.station_distance_mi.toFixed(0)} mi
      </Text>
      {tides.events.length === 0 ? (
        <Text variant="bodySmall" style={styles.message}>
          No tide data for this day.
        </Text>
      ) : (
        <View style={styles.eventList}>
          {tides.events.map((event) => (
            <View key={`${event.time}-${event.kind}`} style={styles.eventRow}>
              <Text variant="bodyMedium" style={styles.eventTime}>
                {formatTideTime(event.time)}
              </Text>
              <Text variant="bodyMedium" style={styles.eventLabel}>
                {extremeLabel(event.kind, event.extreme)}
              </Text>
              <Text variant="bodyMedium" style={styles.eventHeight}>
                {event.height_ft.toFixed(1)} ft
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontWeight: "bold" },
  station: { opacity: 0.75 },
  message: { textAlign: "center", opacity: 0.8 },
  eventList: { gap: 6 },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  eventTime: { flex: 1, fontWeight: "600" },
  eventLabel: { flex: 1.4, opacity: 0.85, textAlign: "center" },
  eventHeight: { flex: 0.8, textAlign: "right", fontWeight: "600" },
});
