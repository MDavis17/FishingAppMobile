import { TripSolunarData } from "common/api/getTripSolunar";
import { TripSolunarStatus } from "features/tripPlanner/hooks/useTripConditions";
import TripCondition from "features/tripPlanner/components/TripCondition";
import { formatSolunarTime } from "features/tripPlanner/utils/tideUtils";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import TripSolunarRow from "./TripSolunarRow";

interface Props {
  solunar: TripSolunarData | null;
  solunarStatus: TripSolunarStatus;
}

export default function TripSolunar({ solunar, solunarStatus }: Props) {
  if (solunarStatus === "error") {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Solunar
        </Text>
        <Text variant="bodySmall" style={styles.message}>
          Couldn&apos;t load solunar.
        </Text>
      </View>
    );
  }

  if (!solunar) {
    return null;
  }

  const hasSunTimes = solunar.sunrise !== null || solunar.sunset !== null;

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Solunar
      </Text>
      {!hasSunTimes ? (
        <Text variant="bodySmall" style={styles.message}>
          No solunar data for this day.
        </Text>
      ) : (
        <>
          <View style={styles.sunRow}>
            <TripCondition
              label="Sunrise"
              value={
                solunar.sunrise !== null
                  ? formatSolunarTime(solunar.sunrise)
                  : "—"
              }
              icon="weather-sunset-up"
            />
            <TripCondition
              label="Sunset"
              value={
                solunar.sunset !== null
                  ? formatSolunarTime(solunar.sunset)
                  : "—"
              }
              icon="weather-sunset-down"
            />
          </View>
          {solunar.periods.length > 0 && (
            <View style={styles.periodList}>
              {solunar.periods.map((period) => (
                <TripSolunarRow
                  key={`${period.kind}-${period.start}`}
                  period={period}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8, paddingVertical: 8 },
  title: { fontWeight: "bold" },
  message: { textAlign: "center", opacity: 0.8 },
  sunRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    gap: 8,
  },
  periodList: { gap: 6, paddingLeft: 8 },
});
