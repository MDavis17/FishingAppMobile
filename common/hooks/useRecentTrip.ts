import { useFocusEffect } from "@react-navigation/native";
import { getRecentTrip } from "features/tripPlanner/api/getRecentTrip";
import {
  applySavedLocationChangeToTrip,
  getSavedLocationMutationEpoch,
  overlaySavedLocationOnTrip,
  subscribeSavedLocationChange,
} from "features/tripPlanner/savedLocationSync";
import { useState, useCallback, useEffect, useRef } from "react";
import { Trip } from "types";

export default function useRecentTrip() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentTrip, setRecentTrip] = useState<Trip | null>(null);
  const fetchGeneration = useRef(0);
  const hasLoadedOnce = useRef(false);

  const fetchRecentTrip = useCallback(async () => {
    const requestGeneration = ++fetchGeneration.current;
    const mutationEpochAtStart = getSavedLocationMutationEpoch();
    const showFullScreenLoader = !hasLoadedOnce.current;
    if (showFullScreenLoader) {
      setIsLoading(true);
    }

    try {
      const response = await getRecentTrip();

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
      setRecentTrip(nextTrip);
      hasLoadedOnce.current = true;
    } catch (error) {
      if (requestGeneration !== fetchGeneration.current) {
        return;
      }
      console.error("Error fetching recent trip:", error);
    } finally {
      if (requestGeneration === fetchGeneration.current && showFullScreenLoader) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return subscribeSavedLocationChange((change) => {
      setRecentTrip((current) =>
        applySavedLocationChangeToTrip(current, change),
      );
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecentTrip();
    }, [fetchRecentTrip]),
  );

  return {
    isLoading,
    fetchRecentTrip,
    recentTrip,
  };
}