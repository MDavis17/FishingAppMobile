import { RouteProp, useRoute } from "@react-navigation/native";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import CatchList from "features/catchLog/components/CatchList";
import AddCatchDialog from "features/catchLog/components/AddCatchDialog";
import useCatchList from "features/catchLog/hooks/useCatchList";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { RootStackParamList, Trip } from "types";
import { useTripContext } from "./TripContext";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import TripDetailHeader from "./TripDetailHeader";
import TripLocationCard from "./TripLocationCard";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const theme = useTheme();
  const { setTrip } = useTripContext();
  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip, markTripComplete } = route.params;
  const { date, location } = trip;
  const [status, setStatus] = useState<Trip["status"]>(trip.status);
  const [addCatchVisible, setAddCatchVisible] = useState(false);
  const { isLoading, catches, deleteCatch, addNewCatch } = useCatchList(
    trip.id,
  );

  useEffect(() => {
    setStatus(trip.status);
    setTrip(trip);
  }, [setTrip, trip]);

  const handleCompleteTrip = () => {
    markTripComplete();
    setStatus("Completed");
  };

  return (
    <View style={styles.headerContainer}>
      <TripDetailHeader status={status} title={location.name} date={date} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TripLocationCard location={location} />
        {/* <View style={styles.catchListContainer}>
          <Text variant="titleMedium" style={styles.catchListTitle}>
            Catch List
          </Text>
          <View style={{ flex: 2 }}>
            <CatchList
              catches={catches}
              isLoading={isLoading}
              deleteCatch={deleteCatch}
              onAddCatchPress={() => setAddCatchVisible(true)}
            />
          </View>
        </View> */}
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
        <AddCatchDialog
          visible={addCatchVisible}
          onDismiss={() => setAddCatchVisible(false)}
          addNewCatch={addNewCatch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flex: 1 },
  container: { flex: 4, padding: 16 },
  catchListTitle: { marginBottom: 8 },
  catchListContainer: { flex: 2, paddingTop: 8, paddingBottom: 8 },
  footerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
