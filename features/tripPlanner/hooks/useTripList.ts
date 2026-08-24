import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Trip } from "types";
import { getTrips } from "../api/getTrips";

export type TripListFilters = {
  status: "All" | "Planned" | "Completed";
  dateSort: "newest" | "oldest";
};

const DEFAULT_FILTERS: TripListFilters = {
  status: "All",
  dateSort: "newest",
};

export default function useTripList() {
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filters, setFilters] = useState<TripListFilters>(DEFAULT_FILTERS);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getTrips();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setTrips(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    if (filters.status !== "All") {
      result = result.filter((trip) => trip.status === filters.status);
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

  const hasTrips = trips.length > 0;
  const hasFilteredTrips = filteredTrips.length > 0;

  return {
    isLoading,
    trips: filteredTrips,
    filters,
    updateFilters,
    hasTrips,
    hasFilteredTrips,
    refetchTrips: fetchTrips,
  };
}
