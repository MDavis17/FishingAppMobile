import { useFocusEffect } from "@react-navigation/native";
import { getUpcomingTrip } from "features/tripPlanner/api/getUpcomingTrip";
import { useState, useCallback } from "react";
import { Trip } from "types";

export default function useUpcomingTrip() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
  const mockWeather = { temp: 72, condition: "Sunny" };

  const fetchUpcomingTrip = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getUpcomingTrip();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setUpcomingTrip(response.data);
    } catch (error) {
      console.error("Error fetching upcoming trip:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingTrip();
    }, [fetchUpcomingTrip])
  );

  return {
    isLoading,
    fetchUpcomingTrip,
    upcomingTrip,
    weather: mockWeather,
  };
}
