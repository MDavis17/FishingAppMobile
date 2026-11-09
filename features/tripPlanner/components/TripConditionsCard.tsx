import Card from "common/components/Card";
import useTripForecast from "features/tripPlanner/hooks/useTripForecast";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Location } from "types";
import TripForecast from "features/tripPlanner/components/TripForecast";
import ConditionChip from "features/tripPlanner/components/ConditionChip";

interface Props {
  location: Location;
  date: string;
}

export default function TripConditionsCard({ location, date }: Props) {
  const theme = useTheme();
  const { forecast, status: forecastStatus } = useTripForecast(location, date);

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            Conditions
          </Text>
          <ConditionChip status={forecastStatus} />
        </View>
        {forecastStatus === "loading" && (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {forecastStatus === "tooFar" && (
          <Text variant="bodySmall" style={styles.message}>
            Forecast is available within a week of the trip.
          </Text>
        )}

        {forecastStatus === "past" && (
          <Text variant="bodySmall" style={styles.message}>
            Observed conditions will show here after the trip.
          </Text>
        )}

        {forecastStatus === "error" && (
          <Text variant="bodySmall" style={styles.message}>
            Couldn't load the forecast.
          </Text>
        )}

        {forecastStatus === "ready" && forecast && (
          <TripForecast forecast={forecast} />
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
