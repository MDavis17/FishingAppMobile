import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Card from "common/components/Card";
import { Trip } from "types";
import MapWindow from "common/components/MapWindow";

interface Props {
  location: Trip["location"];
}

export default function TripLocationCard({ location }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.locationTitle}>
          {location.name}
        </Text>
        <Text variant="bodySmall" style={styles.locationDescription}>
          {location.coordinates.latitude} N, {location.coordinates.longitude} W
        </Text>
        <View style={styles.mapContainer}>
          <MapWindow selectedLocation={location.coordinates} isViewOnly />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  locationTitle: { marginBottom: 4, fontWeight: "bold" },
  locationDescription: { fontSize: 12 },
  card: { flex: 1 },
  mapContainer: { height: 100, marginVertical: 8 },
});
