import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import MapWindow from "common/components/MapWindow";
import CatchList from "features/catchLog/components/CatchList";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "types";
import { useTripContext } from "./TripContext";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const { setTrip } = useTripContext();
  const navigation = useNavigation();

  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip } = route.params;
  const { date, waterType, location } = trip;

  useEffect(() => {
    const formattedDate = new Date(date).toLocaleDateString();
    navigation.setOptions({ title: formattedDate });
    setTrip(trip);
  }, [date, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapWindow
          selectedLocation={location.coordinates}
          height={200}
          isViewOnly
        />
      </View>
      <View style={styles.flex2}>
        <View style={styles.dataContainer}>
          <Text>{waterType}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Catch List
          </Text>
          <View>
            <CatchList tripId={trip.id} />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
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
  flex2: { flex: 2 },
  dataContainer: { paddingTop: 8, paddingBottom: 8 },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
