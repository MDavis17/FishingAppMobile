import Card from "common/components/Card";
import {
  TripConditionsStatus,
  TripSolunarStatus,
} from "features/tripPlanner/hooks/useTripConditions";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { TripConditions } from "common/api/getTripConditions";
import { TripSolunarData } from "common/api/getTripSolunar";
import TripConditionsMetrics from "features/tripPlanner/components/TripConditionsMetrics";
import ConditionChip from "features/tripPlanner/components/ConditionChip";
import Divider from "common/components/Divider";
import TripSolunar from "./TripSolunar";

interface Props {
  conditions: TripConditions | null;
  status: TripConditionsStatus;
  solunar: TripSolunarData | null;
  solunarStatus: TripSolunarStatus;
}

export default function TripConditionsCard({
  conditions,
  status,
  solunar,
  solunarStatus,
}: Props) {
  const theme = useTheme();

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
            <TripSolunar solunar={solunar} solunarStatus={solunarStatus} />
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
