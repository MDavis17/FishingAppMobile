import { useState, useEffect, useCallback } from "react";
import { Trip } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { getTrips } from "../api/getTrips";

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

  // const openNewCatchForm = () => {
  //   navigation.navigate("AddNewCatch", { addNewCatch });
  // };

  // const addNewCatch = async (newCatch: CatchEntry) => {
  //   if (!newCatch.species || !newCatch.dateTime) {
  //     return;
  //   }

  //   try {
  //     const response = await addNewCatchLog(newCatch);

  //     if (!response.ok) {
  //       throw new Error("Something went wrong");
  //     }

  //     await fetchLogs();
  //   } catch (error) {
  //     console.error("Error creating log:", error);
  //     throw error;
  //   }
  // };

  // const deleteCatch = async (catchId: number) => {
  //   try {
  //     const response = await deleteCatchLogById(catchId);

  //     if (!response.ok) {
  //       throw new Error("Something went wrong");
  //     }

  //     setLogs((prevLogs) => prevLogs.filter((log) => log.id != catchId));
  //   } catch (error) {
  //     console.error("Error delete log:", error);
  //     throw error;
  //   }
  // };

  return {
    isLoading,
    trips,
    // openNewCatchForm,
    // deleteCatch,
  };
}
