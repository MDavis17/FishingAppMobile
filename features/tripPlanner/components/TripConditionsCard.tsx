import Card from "common/components/Card";
import useTripConditions from "features/tripPlanner/hooks/useTripConditions";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Location } from "types";
import TripConditionsMetrics from "features/tripPlanner/components/TripConditionsMetrics";
import ConditionChip from "features/tripPlanner/components/ConditionChip";
import Divider from "common/components/Divider";
import TripTides from "./TripTides";

interface Props {
  location: Location;
  date: string;
}

export default function TripConditionsCard({ location, date }: Props) {
  const theme = useTheme();
  const { conditions, status, tides, tidesStatus } = useTripConditions(
    location,
    date,
  );

  const showChip =
    (status === "ready" && conditions !== null) || status === "tooFar";

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            Conditions
          </Text>
          {showChip && (
            <ConditionChip
              source={status === "tooFar" ? "forecast" : conditions!.source}
            />
          )}
        </View>
        {status === "loading" && (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {status === "tooFar" && (
          <Text variant="bodySmall" style={styles.message}>
            Forecast is available within a week of the trip.
          </Text>
        )}

        {status === "error" && (
          <Text variant="bodySmall" style={styles.message}>
            Couldn't load conditions.
          </Text>
        )}

        {status === "ready" && conditions && (
          <TripConditionsMetrics conditions={conditions} />
        )}
        {status !== "loading" && (
          <>
            <Divider />
            <TripTides tides={tides} tidesStatus={tidesStatus} />
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: "bold" },
  card: { flex: 1 },
  centered: { paddingVertical: 12, alignItems: "center" },
  message: { textAlign: "center", opacity: 0.8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
});
