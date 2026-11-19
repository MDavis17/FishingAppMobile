import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Species } from "types";
import { getSpecies, SpeciesSort } from "features/analysis/api/getSpecies";

export type SpeciesCaughtStatus = "All" | "Caught" | "Uncaught";

export type SpeciesListFilters = {
  caughtStatus: SpeciesCaughtStatus;
  favoritesOnly: boolean;
  nameSort: SpeciesSort;
};

export const DEFAULT_SPECIES_FILTERS: SpeciesListFilters = {
  caughtStatus: "All",
  favoritesOnly: false,
  nameSort: "name_asc",
};

type Options = {
  kingdom: "animal" | "plant";
  search: string;
  filters: SpeciesListFilters;
};

export default function useFilteredSpeciesList({
  kingdom,
  search,
  filters,
}: Options) {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  const queryParams = useMemo(() => {
    const caught =
      filters.caughtStatus === "Caught"
        ? ("caught" as const)
        : filters.caughtStatus === "Uncaught"
          ? ("uncaught" as const)
          : undefined;

    return {
      kingdom,
      search: search.trim() || undefined,
      caught: kingdom === "animal" ? caught : undefined,
      favoritesOnly: filters.favoritesOnly || undefined,
      sort: filters.nameSort,
    };
  }, [filters, kingdom, search]);

  const fetchSpecies = useCallback(
    async (mode: "initial" | "refresh" | "update") => {
      if (mode === "initial") {
        setIsInitialLoading(true);
      } else if (mode === "refresh") {
        setIsRefreshing(true);
      }

      try {
        const response = await getSpecies(queryParams);

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        setSpeciesList(response.data.species ?? []);
        hasLoadedOnce.current = true;
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        if (mode === "initial") {
          setIsInitialLoading(false);
        } else if (mode === "refresh") {
          setIsRefreshing(false);
        }
      }
    },
    [queryParams],
  );

  useEffect(() => {
    const mode = hasLoadedOnce.current ? "update" : "initial";
    fetchSpecies(mode);
  }, [fetchSpecies]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedOnce.current) {
        fetchSpecies("update");
      }
    }, [fetchSpecies]),
  );

  const refreshSpecies = useCallback(() => {
    return fetchSpecies("refresh");
  }, [fetchSpecies]);

  return {
    isInitialLoading,
    isRefreshing,
    speciesList,
    refreshSpecies,
  };
}