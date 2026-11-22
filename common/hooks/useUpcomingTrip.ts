import { useFocusEffect } from "@react-navigation/native";
import { getUpcomingTrip } from "features/tripPlanner/api/getUpcomingTrip";
import {
  applySavedLocationChangeToTrip,
  getSavedLocationMutationEpoch,
  overlaySavedLocationOnTrip,
  subscribeSavedLocationChange,
} from "features/tripPlanner/savedLocationSync";
import { useState, useCallback, useEffect, useRef } from "react";
import { Trip } from "types";

export default function useUpcomingTrip() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
  const mockWeather = { temp: 72, condition: "Sunny" };
  const fetchGeneration = useRef(0);
  const hasLoadedOnce = useRef(false);

  const fetchUpcomingTrip = useCallback(async () => {
    const requestGeneration = ++fetchGeneration.current;
    const mutationEpochAtStart = getSavedLocationMutationEpoch();
    const showFullScreenLoader = !hasLoadedOnce.current;
    if (showFullScreenLoader) {
      setIsLoading(true);
    }

    try {
      const response = await getUpcomingTrip();

      if (requestGeneration !== fetchGeneration.current) {
        return;
      }

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const nextTrip = overlaySavedLocationOnTrip(
        (response.data as Trip | null) ?? null,
        mutationEpochAtStart,
      );
      setUpcomingTrip(nextTrip);
      hasLoadedOnce.current = true;
    } catch (error) {
      if (requestGeneration !== fetchGeneration.current) {
        return;
      }
      console.error("Error fetching upcoming trip:", error);
    } finally {
      if (requestGeneration === fetchGeneration.current && showFullScreenLoader) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return subscribeSavedLocationChange((change) => {
      setUpcomingTrip((current) =>
        applySavedLocationChangeToTrip(current, change),
      );
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingTrip();
    }, [fetchUpcomingTrip]),
  );

  return {
    isLoading,
    fetchUpcomingTrip,
    upcomingTrip,
    weather: mockWeather,
  };
}