import { useFocusEffect } from "@react-navigation/native";
import { getRecentTrip } from "features/tripPlanner/api/getRecentTrip";
import { useState, useCallback } from "react";
import { Trip } from "types";

export default function useRecentTrip() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentTrip, setRecentTrip] = useState<Trip | null>(null);

  const fetchRecentTrip = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getRecentTrip();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setRecentTrip(response.data);
    } catch (error) {
      console.error("Error fetching upcoming trip:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecentTrip();
    }, [fetchRecentTrip])
  );

  return {
    isLoading,
    fetchRecentTrip,
    recentTrip,
  };
}
