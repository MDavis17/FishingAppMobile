import { useFocusEffect } from "@react-navigation/native";
import { isFutureDate } from "common/utils/DateUtils";
import { getTrips } from "features/tripPlanner/api/getTrips";
import { useState, useCallback } from "react";
import { Trip } from "types";

export default function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getTrips();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setTrips(response.data);
      setUpcomingTrips(
        response.data.filter((trip: Trip) => isFutureDate(trip.date))
      );
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  return {
    isLoading,
    trips,
    setTrips,
    fetchTrips,
    upcomingTrips,
  };
}
