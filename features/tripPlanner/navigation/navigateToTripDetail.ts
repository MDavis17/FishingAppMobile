import { NavigationProp } from "@react-navigation/native";
import { Trip } from "types";
import { deleteTrip as deleteTripApi } from "../api/deleteTrip";
import { markTripComplete as markTripCompleteApi } from "../api/markTripComplete";

export function navigateToTripDetail(
  navigation: NavigationProp<Record<string, object | undefined>>,
  trip: Trip,
) {
  const handleDeleteTrip = async () => {
    try {
      const response = await deleteTripApi(trip.id);
      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleMarkTripComplete = async () => {
    try {
      const response = await markTripCompleteApi(trip.id);
      if (!response.ok) {
        throw new Error("Failed to mark trip as complete");
      }
    } catch (error) {
      console.error("Error marking trip complete:", error);
    }
  };

  const tabNavigation = navigation.getParent() ?? navigation;
  tabNavigation.navigate("Trips", {
    screen: "TripDetail",
    params: {
      trip,
      deleteTrip: handleDeleteTrip,
      markTripComplete: handleMarkTripComplete,
    },
  });
}
