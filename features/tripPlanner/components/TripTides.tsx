import ConditionChip from "features/tripPlanner/components/ConditionChip";
import { TripTidesData } from "common/api/getTripTides";
import { TripTidesStatus } from "features/tripPlanner/hooks/useTripConditions";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import TripTideRow from "./TripTideRow";

interface Props {
  tides: TripTidesData | null;
  tidesStatus: TripTidesStatus;
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
        <View style={styles.stationContainer}>
          <Text variant="bodySmall" style={styles.station}>
            {tides.station_name} · {tides.station_distance_mi.toFixed(0)} mi
          </Text>
        </View>
      </View>
      {tides.events.length === 0 ? (
        <Text variant="bodySmall" style={styles.message}>
          No tide data for this day.
        </Text>
      ) : (
        <View style={styles.eventList}>
          {tides.events.map((event) => (
            <TripTideRow key={`${event.time}-${event.kind}`} event={event} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontWeight: "bold" },
  station: { opacity: 0.75 },
  stationContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  message: { textAlign: "center", opacity: 0.8 },
  eventList: { gap: 6 },
});
