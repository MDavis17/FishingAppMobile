import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getSavedLocations } from "features/tripPlanner/api/getSavedLocations";
import { SavedLocation, TripType } from "types";

export type SavedLocationCatchStatus = "All" | "Caught" | "Uncaught";

export type SavedLocationDateSort = "newest" | "oldest";

export type SavedLocationListFilters = {
  dateSort: SavedLocationDateSort;
  tripTypes: TripType[];
  catchStatus: SavedLocationCatchStatus;
};

export const DEFAULT_SAVED_LOCATION_FILTERS: SavedLocationListFilters = {
  dateSort: "newest",
  tripTypes: [],
  catchStatus: "All",
};

type Options = {
  search: string;
  filters: SavedLocationListFilters;
};

export default function useSavedLocationList({ search, filters }: Options) {
  const [allLocations, setAllLocations] = useState<SavedLocation[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  const fetchLocations = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "initial") {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await getSavedLocations();
      if (!response.ok) {
        throw new Error("Failed to load saved locations");
      }
      const data = response.data;
      const list = Array.isArray(data)
        ? (data as SavedLocation[])
        : ((data as { locations?: SavedLocation[] })?.locations ?? []);
      setAllLocations(list);
      hasLoadedOnce.current = true;
    } catch (error) {
      console.error("useSavedLocationList: fetch failed", error);
    } finally {
      if (mode === "initial") {
        setIsInitialLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchLocations("initial");
  }, [fetchLocations]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedOnce.current) {
        void fetchLocations("refresh");
      }
    }, [fetchLocations]),
  );

  const removeLocationLocally = useCallback((id: number) => {
    setAllLocations((prev) => prev.filter((loc) => loc.id !== id));
  }, []);

  const restoreLocationLocally = useCallback((location: SavedLocation) => {
    setAllLocations((prev) =>
      [...prev, location].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }, []);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = allLocations;

    if (query) {
      list = list.filter((loc) =>
        loc.location.name.toLowerCase().includes(query),
      );
    }

    if (filters.catchStatus === "Caught") {
      list = list.filter((loc) => loc.didCatchFishHere);
    } else if (filters.catchStatus === "Uncaught") {
      list = list.filter((loc) => !loc.didCatchFishHere);
    }

    if (filters.tripTypes.length > 0) {
      list = list.filter(
        (loc) =>
          loc.tripType != null && filters.tripTypes.includes(loc.tripType),
      );
    }

    const sorted = [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return filters.dateSort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return sorted;
  }, [allLocations, search, filters]);

  const hasLocations = allLocations.length > 0;
  const hasFilteredLocations = filteredLocations.length > 0;

  return {
    isInitialLoading,
    isRefreshing,
    locations: filteredLocations,
    hasLocations,
    hasFilteredLocations,
    refreshLocations: () => fetchLocations("refresh"),
    removeLocationLocally,
    restoreLocationLocally,
  };
}