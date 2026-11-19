import { useCallback, useEffect, useState } from "react";
import { Species } from "types";
import { getSpecies } from "../api/getSpecies";
import { toggleSpeciesFavorite } from "../api/toggleSpeciesFavorite";

type CacheEntry = {
  speciesList: Species[];
  favoriteSpeciesList: Species[];
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

function insertSortedByName(list: Species[], species: Species): Species[] {
  const next = [...list, species];
  next.sort((a, b) => a.name.localeCompare(b.name));
  return next;
}

function moveFavoriteInLists(
  speciesList: Species[],
  favoriteSpeciesList: Species[],
  speciesId: number,
  isFavorite: boolean,
): CacheEntry | null {
  const inFavorites = favoriteSpeciesList.find((s) => s.id === speciesId);
  const inSpecies = speciesList.find((s) => s.id === speciesId);
  const species = inFavorites ?? inSpecies;
  if (!species || species.isFavorite === isFavorite) {
    return null;
  }

  const updated = { ...species, isFavorite };

  if (isFavorite) {
    return {
      speciesList: speciesList.filter((s) => s.id !== speciesId),
      favoriteSpeciesList: insertSortedByName(
        favoriteSpeciesList.filter((s) => s.id !== speciesId),
        updated,
      ),
    };
  }

  return {
    speciesList: insertSortedByName(
      speciesList.filter((s) => s.id !== speciesId),
      updated,
    ),
    favoriteSpeciesList: favoriteSpeciesList.filter((s) => s.id !== speciesId),
  };
}

function applyFavoriteToCache(speciesId: number, isFavorite: boolean) {
  for (const [key, entry] of speciesCache.entries()) {
    const next = moveFavoriteInLists(
      entry.speciesList,
      entry.favoriteSpeciesList,
      speciesId,
      isFavorite,
    );
    if (!next) {
      continue;
    }
    speciesCache.set(key, next);
    notifyListeners(key, next);
  }

  // If list was never loaded, buckets are empty — still try to update any in-memory
  // hooks by checking keys that have listeners but no cache yet (skip — no data to move)
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
  const [favoriteSpeciesList, setFavoriteSpeciesList] = useState<Species[]>(
    cached?.favoriteSpeciesList ?? [],
  );
  const [isLoading, setIsLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    return subscribe(key, (entry) => {
      setSpeciesList(entry.speciesList);
      setFavoriteSpeciesList(entry.favoriteSpeciesList);
    });
  }, [key]);

  const applyEntry = useCallback((entry: CacheEntry) => {
    speciesCache.set(key, entry);
    setSpeciesList(entry.speciesList);
    setFavoriteSpeciesList(entry.favoriteSpeciesList);
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
        const response = await getSpecies(kingdom);

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const entry: CacheEntry = {
          speciesList: response.data.species,
          favoriteSpeciesList: response.data.favoriteSpecies,
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

        const inFavorites = favoriteSpeciesList.find((s) => s.id === speciesId);
        const inSpecies = speciesList.find((s) => s.id === speciesId);
        const species = inFavorites ?? inSpecies;
        if (!species) {
          return;
        }

        applySpeciesFavorite(speciesId, !species.isFavorite);
      } catch (error) {
        console.error("Error toggling species favorite:", error);
        throw error;
      }
    },
    [favoriteSpeciesList, speciesList],
  );

  return {
    isLoading,
    isRefreshing,
    speciesList,
    favoriteSpeciesList,
    setSpeciesList,
    setFavoriteSpeciesList,
    refreshSpecies,
    fetchSpecies: refreshSpecies,
    toggleFavorite,
  };
}