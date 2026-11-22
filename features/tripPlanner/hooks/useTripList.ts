import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trip, TripType } from "types";
import { deleteTrip as deleteTripApi } from "../api/deleteTrip";
import { getTrips } from "../api/getTrips";
import {
  applySavedLocationChangeToTrips,
  getSavedLocationMutationEpoch,
  overlaySavedLocationOnTrips,
  SavedLocationChange,
  subscribeSavedLocationChange,
} from "../savedLocationSync";

export type TripListFilters = {
  status: "All" | "Planned" | "Completed";
  dateSort: "newest" | "oldest";
  tripTypes: TripType[];
};

export const DEFAULT_FILTERS: TripListFilters = {
  status: "All",
  dateSort: "newest",
  tripTypes: [],
};

export default function useTripList() {
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filters, setFilters] = useState<TripListFilters>(DEFAULT_FILTERS);
  const fetchGeneration = useRef(0);
  const hasLoadedOnce = useRef(false);

  const applySavedLocationChange = useCallback((change: SavedLocationChange) => {
    setTrips((prevTrips) => applySavedLocationChangeToTrips(prevTrips, change));
  }, []);

  const fetchTrips = useCallback(async () => {
    const requestGeneration = ++fetchGeneration.current;
    const mutationEpochAtStart = getSavedLocationMutationEpoch();
    const showFullScreenLoader = !hasLoadedOnce.current;
    if (showFullScreenLoader) {
      setIsLoading(true);
    }

    try {
      const response = await getTrips();

      if (requestGeneration !== fetchGeneration.current) {
        return;
      }

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const nextTrips = overlaySavedLocationOnTrips(
        Array.isArray(response.data) ? response.data : [],
        mutationEpochAtStart,
      );
      setTrips(nextTrips);
      hasLoadedOnce.current = true;
    } catch (error) {
      if (requestGeneration !== fetchGeneration.current) {
        return;
      }
      console.error("Error fetching trips:", error);
      if (!hasLoadedOnce.current) {
        setTrips([]);
      }
    } finally {
      if (requestGeneration === fetchGeneration.current && showFullScreenLoader) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return subscribeSavedLocationChange((change) => {
      applySavedLocationChange(change);
    });
  }, [applySavedLocationChange]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips]),
  );

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    if (filters.status !== "All") {
      result = result.filter((trip) => trip.status === filters.status);
    }

    if (filters.tripTypes.length > 0) {
      const allowedTypes = new Set(filters.tripTypes);
      result = result.filter((trip) => allowedTypes.has(trip.tripType));
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [trips, filters]);

  const updateFilters = useCallback((updates: Partial<TripListFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const replaceFilters = useCallback((next: TripListFilters) => {
    setFilters(next);
  }, []);

  const deleteTrip = useCallback(async (tripId: number) => {
    try {
      const response = await deleteTripApi(tripId);

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  }, []);

  const hasTrips = trips.length > 0;
  const hasFilteredTrips = filteredTrips.length > 0;

  return {
    isLoading,
    trips: filteredTrips,
    filters,
    updateFilters,
    replaceFilters,
    hasTrips,
    hasFilteredTrips,
    refetchTrips: fetchTrips,
    deleteTrip,
  };
}