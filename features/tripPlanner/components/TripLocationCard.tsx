import { Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Card from "common/components/Card";
import MapWindow from "common/components/MapWindow";
import SaveLocationButton from "features/tripPlanner/components/SaveLocationButton";
import useSaveLocation from "features/tripPlanner/hooks/useSaveLocation";
import { Location, TripType } from "types";

interface Props {
  location: Location;
  tripType: TripType;
}

export default function TripLocationCard({ location, tripType }: Props) {
  const { isSaved, isInitializing, save, unsave } = useSaveLocation(
    location,
    tripType,
  );

  const latitude = location.coordinates.latitude;
  const longitude = location.coordinates.longitude;
  const latitudeDirection = latitude > 0 ? "N" : "S";
  const longitudeDirection = longitude > 0 ? "E" : "W";

  const confirmUnsave = () => {
    Alert.alert(
      "Remove saved location?",
      "This spot will be removed from your saved locations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void unsave();
          },
        },
      ],
    );
  };

  const handleButtonPress = () => {
    if (isInitializing) {
      return;
    }
    if (isSaved) {
      confirmUnsave();
      return;
    }
    void save();
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.locationTitle}>
              {location.name}
            </Text>
            <Text variant="bodySmall" style={styles.locationDescription}>
              {latitude.toFixed(5)}° {latitudeDirection}, {longitude.toFixed(5)}
              ° {longitudeDirection}
            </Text>
          </View>
          <SaveLocationButton
            isSaved={isSaved}
            disabled={isInitializing}
            onPress={handleButtonPress}
          />
        </View>
        <View style={styles.mapContainer}>
          <MapWindow selectedLocation={location.coordinates} isViewOnly />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  headerText: { flex: 1 },
  locationTitle: { marginBottom: 4, fontWeight: "bold" },
  locationDescription: { fontSize: 12, marginBottom: 8 },
  card: { flex: 1 },
  mapContainer: { height: 100 },
});
