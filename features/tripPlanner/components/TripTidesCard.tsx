import Card from "common/components/Card";
import { TripTidesData } from "common/api/getTripTides";
import { TripTidesStatus } from "features/tripPlanner/hooks/useTripConditions";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import TripTides from "./TripTides";

interface Props {
  tides: TripTidesData | null;
  tidesStatus: TripTidesStatus;
  isLoading: boolean;
}

export default function TripTidesCard({
  tides,
  tidesStatus,
  isLoading,
}: Props) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <TripTides tides={tides} tidesStatus={tidesStatus} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  container: { flex: 1, padding: 16 },
  centered: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
