import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import MapWindow from "common/components/MapWindow";
import CatchList from "features/catchLog/components/CatchList";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "types";
import { useTripContext } from "./TripContext";
import PrimaryButton from "common/components/buttons/PrimaryButton";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const { setTrip } = useTripContext();
  const navigation = useNavigation();
  const [status, setStatus] = useState('Planned');

  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip, markTripComplete } = route.params;
  const { date, waterType, location } = trip;

  useEffect(() => {
    const formattedDate = new Date(date).toLocaleDateString();
    navigation.setOptions({ title: formattedDate });
    setStatus(trip.status);
    setTrip(trip);
  }, [date, navigation]);

  const handleCompleteTrip = () => {
    markTripComplete();
    setStatus('Completed');
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapWindow
          selectedLocation={location.coordinates}
          height={200}
          isViewOnly
        />
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
        {status === "Planned" && <PrimaryButton onPress={handleCompleteTrip}>Mark Trip Complete</PrimaryButton>}
        <TertiaryButton onPress={deleteTrip} textColor="red">
          Delete
        </TertiaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  mapContainer: { flex: 1 },
  catchListTitle: { marginBottom: 8 },
  catchListContainer: { flex: 2, paddingTop: 8, paddingBottom: 8 },
  footerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
