import Card from "common/components/Card";
import { TripSolunarData } from "common/api/getTripSolunar";
import { TripSolunarStatus } from "features/tripPlanner/hooks/useTripConditions";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import TripSolunar from "./TripSolunar";

interface Props {
  solunar: TripSolunarData | null;
  solunarStatus: TripSolunarStatus;
  isLoading: boolean;
  tripDateIso: string;
}

export default function TripSolunarCard({
  solunar,
  solunarStatus,
  isLoading,
  tripDateIso,
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
        <TripSolunar
          solunar={solunar}
          solunarStatus={solunarStatus}
          tripDateIso={tripDateIso}
        />
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
