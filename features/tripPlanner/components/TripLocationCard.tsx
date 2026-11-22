import { Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Card from "common/components/Card";
import MapWindow from "common/components/MapWindow";
import SaveLocationButton from "features/tripPlanner/components/SaveLocationButton";
import useSaveLocation from "features/tripPlanner/hooks/useSaveLocation";
import { settleSavedLocationChange } from "features/tripPlanner/savedLocationSync";
import { Location, TripType } from "types";

interface Props {
  location: Location;
  tripType: TripType;
  tripId?: number;
  initialSavedLocationId?: number | null;
  onSavedStatusChange?: (savedLocationId: number | null) => void;
}

export default function TripLocationCard({
  location,
  tripType,
  tripId,
  initialSavedLocationId,
  onSavedStatusChange,
}: Props) {
  const { isSaved, savedLocationId, save, unsave } = useSaveLocation(
    location,
    tripType,
    initialSavedLocationId,
    tripId,
  );

  const latitude = location.coordinates.latitude;
  const longitude = location.coordinates.longitude;
  const latitudeDirection = latitude > 0 ? "N" : "S";
  const longitudeDirection = longitude > 0 ? "E" : "W";

  const confirmUnsave = (locationId: number) => {
    Alert.alert(
      "Remove saved location?",
      "This spot will be removed from your saved locations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void unsave(locationId, onSavedStatusChange);
          },
        },
      ],
    );
  };

  const handleButtonPress = () => {
    if (isSaved && savedLocationId !== null) {
      confirmUnsave(savedLocationId);
      return;
    }
    void save().then((savedId) => {
      if (savedId !== null) {
        onSavedStatusChange?.(savedId);
        settleSavedLocationChange();
      }
    });
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
