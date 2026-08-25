import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import MapWindow from "common/components/MapWindow";
import CatchList from "features/catchLog/components/CatchList";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList, Trip } from "types";
import { useTripContext } from "./TripContext";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import TripWeather from "./TripWeather";
import TripStatusChip from "./TripStatusChip";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const { setTrip } = useTripContext();
  const navigation = useNavigation();
  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip, markTripComplete } = route.params;
  const { date, location } = trip;
  const [status, setStatus] = useState<Trip["status"]>(trip.status);

  useLayoutEffect(() => {
    navigation.setOptions({ title: location.name });
  }, [location.name, navigation]);

  useEffect(() => {
    setStatus(trip.status);
    setTrip(trip);
  }, [setTrip, trip]);

  const handleCompleteTrip = () => {
    markTripComplete();
    setStatus("Completed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapWindow selectedLocation={location.coordinates} isViewOnly />
      </View>
      <View style={styles.statusContainer}>
        <TripStatusChip status={status} />
      </View>
      <View style={styles.weatherContainer}>
        <TripWeather location={location} date={date} />
      </View>
      <View style={styles.catchListContainer}>
        <Text variant="titleMedium" style={styles.catchListTitle}>
          Catch List
        </Text>
        <View style={{ flex: 2 }}>
          <CatchList tripId={trip.id} />
        </View>
      </View>
      <View style={styles.footerContainer}>
        {status === "Planned" && (
          <PrimaryButton onPress={handleCompleteTrip}>
            Mark Trip Complete
          </PrimaryButton>
        )}
        <TertiaryButton onPress={deleteTrip} textColor="red">
          Delete
        </TertiaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  mapContainer: { flex: 2 },
  catchListTitle: { marginBottom: 8 },
  catchListContainer: { flex: 2, paddingTop: 8, paddingBottom: 8 },
  footerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  weatherContainer: {
    flex: 1,
  },
  statusContainer: {
    paddingVertical: 8,
  },
});
