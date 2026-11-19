import { useCallback, useEffect, useState } from "react";
import { Species } from "types";
import { getSpecies } from "../api/getSpecies";
import { toggleSpeciesFavorite } from "../api/toggleSpeciesFavorite";

type CacheEntry = {
  speciesList: Species[];
};

type ListListener = (entry: CacheEntry) => void;

function cacheKey(kingdom?: string) {
  return kingdom ?? "all";
}

const speciesCache = new Map<string, CacheEntry>();
const listenersByKey = new Map<string, Set<ListListener>>();

function subscribe(key: string, listener: ListListener) {
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(key, listeners);
  }
  listeners.add(listener);
  return () => {
    listeners?.delete(listener);
  };
}

function notifyListeners(key: string, entry: CacheEntry) {
  listenersByKey.get(key)?.forEach((listener) => listener(entry));
}

function applyFavoriteToCache(speciesId: number, isFavorite: boolean) {
  for (const [key, entry] of speciesCache.entries()) {
    const index = entry.speciesList.findIndex((s) => s.id === speciesId);
    if (index === -1) {
      continue;
    }
    const updatedList = [...entry.speciesList];
    updatedList[index] = { ...updatedList[index], isFavorite };
    const next: CacheEntry = { speciesList: updatedList };
    speciesCache.set(key, next);
    notifyListeners(key, next);
  }
}

export function applySpeciesFavorite(speciesId: number, isFavorite: boolean) {
  applyFavoriteToCache(speciesId, isFavorite);
}

export default function useSpeciesList(kingdom?: string) {
  const key = cacheKey(kingdom);
  const cached = speciesCache.get(key);

  const [speciesList, setSpeciesList] = useState<Species[]>(
    cached?.speciesList ?? [],
  );
  const [isLoading, setIsLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    return subscribe(key, (entry) => {
      setSpeciesList(entry.speciesList);
    });
  }, [key]);

  const applyEntry = useCallback((entry: CacheEntry) => {
    speciesCache.set(key, entry);
    setSpeciesList(entry.speciesList);
    notifyListeners(key, entry);
  }, [key]);

  const loadFromApi = useCallback(
    async (mode: "initial" | "refresh") => {
      if (mode === "initial") {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const response = await getSpecies(
          kingdom ? { kingdom, sort: "name_asc" } : { sort: "name_asc" },
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const entry: CacheEntry = {
          speciesList: response.data.species,
        };
        applyEntry(entry);
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        if (mode === "initial") {
          setIsLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [applyEntry, kingdom],
  );

  useEffect(() => {
    if (speciesCache.has(key)) {
      return;
    }
    loadFromApi("initial");
  }, [key, loadFromApi]);

  const refreshSpecies = useCallback(() => {
    return loadFromApi("refresh");
  }, [loadFromApi]);

  const toggleFavorite = useCallback(
    async (speciesId: number) => {
      try {
        const response = await toggleSpeciesFavorite(speciesId);

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const species = speciesList.find((s) => s.id === speciesId);
        if (!species) {
          return;
        }

        applySpeciesFavorite(speciesId, !species.isFavorite);
      } catch (error) {
        console.error("Error toggling species favorite:", error);
        throw error;
      }
    },
    [speciesList],
  );

  return {
    isLoading,
    isRefreshing,
    speciesList,
    setSpeciesList,
    refreshSpecies,
    fetchSpecies: refreshSpecies,
    toggleFavorite,
  };
}