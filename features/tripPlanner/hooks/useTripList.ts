import { useState, useEffect, useCallback } from "react";
import { Trip } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { getTrips } from "../api/getTrips";
import { deleteTripById } from "../api/deleteTripById";
import { addNewTrip } from "../api/addNewTrip";

export default function useTripList() {
  const navigation = useNavigation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getTrips();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

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

  return {
    isLoading,
    trips,
    openNewTripForm,
    deleteTrip,
  };
}
