import { Trip } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { deleteTripById } from "../api/deleteTripById";
import { addNewTrip } from "../api/addNewTrip";
import useTrips from "common/hooks/useTrips";
import { markTripCompletedById } from "../api/markTripCompletedById";

export default function useTripList() {
  const navigation = useNavigation();
  const { isLoading, trips, setTrips, fetchTrips } = useTrips();

  const openNewTripForm = () => {
    navigation.navigate("NewTrip", { createNewTrip });
  };

  const createNewTrip = async (newTrip: Trip) => {
    if (!newTrip.date || !newTrip.location) {
      return;
    }

    try {
      const response = await addNewTrip(newTrip);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      await fetchTrips();
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      const response = await deleteTripById(tripId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setTrips((prevLogs) => prevLogs.filter((log) => log.id != tripId));
    } catch (error) {
      console.error("Error delete trip:", error);
      throw error;
    }
  };

  const markTripComplete = async (tripId: number) => {
    try {
      await markTripCompletedById(tripId);
      await fetchTrips();

    } catch (error) {
      console.error("Error mark trip complete:", error);
      throw error;
    }
  };

  return {
    isLoading,
    trips,
    openNewTripForm,
    deleteTrip,
    markTripComplete,
    fetchTrips,
  };
}
