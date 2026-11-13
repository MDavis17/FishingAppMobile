import { TripSolunarData, SolunarPeriod } from "common/api/getTripSolunar";
import { TripSolunarStatus } from "features/tripPlanner/hooks/useTripConditions";
import { formatSolunarTime } from "features/tripPlanner/utils/tideUtils";
import { parseTideTimeMs } from "features/tripPlanner/utils/tideChart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Divider from "common/components/Divider";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import TripSolunarRow from "./TripSolunarRow";
import SolunarTimeline from "./SolunarTimeline";

interface Props {
  solunar: TripSolunarData | null;
  solunarStatus: TripSolunarStatus;
  tripDateIso: string;
}

function sortPeriods(periods: SolunarPeriod[]): SolunarPeriod[] {
  return [...periods].sort(
    (a, b) => parseTideTimeMs(a.start) - parseTideTimeMs(b.start),
  );
}

function splitIntoColumns(
  periods: SolunarPeriod[],
): [SolunarPeriod | null, SolunarPeriod | null][] {
  const pairs: [SolunarPeriod | null, SolunarPeriod | null][] = [];
  for (let i = 0; i < periods.length; i += 2) {
    pairs.push([periods[i] ?? null, periods[i + 1] ?? null]);
  }
  return pairs;
}

function SunTimeCell({
  label,
  time,
  icon,
}: {
  label: string;
  time: string;
  icon: "weather-sunset-up" | "weather-sunset-down";
}) {
  const theme = useTheme();
  return (
    <View style={styles.sunCell}>
      <MaterialCommunityIcons
        name={icon}
        size={36}
        color={theme.colors.primary}
      />
      <View>
        <Text variant="bodySmall" style={styles.sunLabel}>
          {label}
        </Text>
        <Text variant="titleMedium" style={styles.sunTime}>
          {time}
        </Text>
      </View>
    </View>
  );
}

export default function TripSolunar({
  solunar,
  solunarStatus,
  tripDateIso,
}: Props) {
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
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Solunar
        </Text>
        <Text variant="bodySmall" style={styles.message}>
          No solunar data for this day.
        </Text>
      </View>
    );
  }

  const hasSunTimes = solunar.sunrise !== null || solunar.sunset !== null;
  const majors = sortPeriods(solunar.periods.filter((p) => p.kind === "major"));
  const minors = sortPeriods(solunar.periods.filter((p) => p.kind === "minor"));
  const majorRows = splitIntoColumns(majors);
  const minorRows = splitIntoColumns(minors);

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
            <SunTimeCell
              label="Sunrise"
              time={
                solunar.sunrise !== null
                  ? formatSolunarTime(solunar.sunrise)
                  : "—"
              }
              icon="weather-sunset-up"
            />
            <View style={styles.sunDivider} />
            <SunTimeCell
              label="Sunset"
              time={
                solunar.sunset !== null
                  ? formatSolunarTime(solunar.sunset)
                  : "—"
              }
              icon="weather-sunset-down"
            />
          </View>
          {solunar.periods.length > 0 && (
            <SolunarTimeline solunar={solunar} tripDateIso={tripDateIso} />
          )}
          {(majors.length > 0 || minors.length > 0) && (
            <>
              <Divider styleOveride={styles.sectionDivider} />
              <View style={styles.periodGrid}>
                {majorRows.map((pair, rowIndex) => (
                  <View key={`major-row-${rowIndex}`} style={styles.gridRow}>
                    <View style={styles.gridCol}>
                      {pair[0] && <TripSolunarRow period={pair[0]} />}
                    </View>
                    <View style={styles.gridColDivider} />
                    <View style={styles.gridCol}>
                      {pair[1] && <TripSolunarRow period={pair[1]} />}
                    </View>
                  </View>
                ))}
                {minorRows.map((pair, rowIndex) => (
                  <View key={`minor-row-${rowIndex}`} style={styles.gridRow}>
                    <View style={styles.gridCol}>
                      {pair[0] && <TripSolunarRow period={pair[0]} />}
                    </View>
                    <View style={styles.gridColDivider} />
                    <View style={styles.gridCol}>
                      {pair[1] && <TripSolunarRow period={pair[1]} />}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  title: { fontWeight: "bold" },
  message: { textAlign: "center", opacity: 0.8 },
  sunRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sunCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  sunLabel: { opacity: 0.75 },
  sunTime: { fontWeight: "700" },
  sunDivider: {
    width: 1,
    height: 48,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  sectionDivider: { marginTop: 0, marginBottom: 8 },
  periodGrid: { gap: 10 },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridCol: {
    flex: 1,
    minWidth: 0,
  },
  gridColDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
});
