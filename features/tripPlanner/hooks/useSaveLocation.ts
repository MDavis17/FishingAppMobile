import { deleteSavedLocation } from "features/tripPlanner/api/deleteSavedLocation";
import { getSavedLocations } from "features/tripPlanner/api/getSavedLocations";
import { saveLocation } from "features/tripPlanner/api/saveLocation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Location, SavedLocation, TripType } from "types";

const COORD_MATCH_EPSILON = 0.00001;

function coordinatesMatch(
  a: Location["coordinates"],
  b: Location["coordinates"],
): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < COORD_MATCH_EPSILON &&
    Math.abs(a.longitude - b.longitude) < COORD_MATCH_EPSILON
  );
}

function findMatchingSaved(
  savedList: SavedLocation[],
  location: Location,
): SavedLocation | undefined {
  return savedList.find((row) => coordinatesMatch(row.location.coordinates, location.coordinates));
}

type SaveLocationResponse = {
  message?: string;
  location?: SavedLocation;
};

export default function useSaveLocation(location: Location, tripType: TripType) {
  const [savedLocationId, setSavedLocationId] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const isMutatingRef = useRef(false);

  const lat = location.coordinates.latitude;
  const lng = location.coordinates.longitude;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsInitializing(true);
      setSavedLocationId(null);

      try {
        const response = await getSavedLocations();
        if (!response.ok) {
          throw new Error("Failed to load saved locations");
        }

        const list = Array.isArray(response.data)
          ? (response.data as SavedLocation[])
          : [];
        const match = findMatchingSaved(list, location);
        if (!cancelled) {
          setSavedLocationId(match?.id ?? null);
        }
      } catch (error) {
        console.error("useSaveLocation: failed to load saved locations", error);
        if (!cancelled) {
          setSavedLocationId(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, location]);

  const save = useCallback(async () => {
    if (isMutatingRef.current || savedLocationId !== null) {
      return;
    }

    isMutatingRef.current = true;
    try {
      const response = await saveLocation({
        location,
        didCatchFishHere: false,
        notes: null,
        tripType,
      });

      if (!response.ok) {
        throw new Error("Failed to save location");
      }

      const data = response.data as SaveLocationResponse;
      const id = data.location?.id;
      if (id === undefined) {
        throw new Error("Invalid save response");
      }
      setSavedLocationId(id);
    } catch (error) {
      console.error("useSaveLocation: save failed", error);
      Alert.alert(
        "Could not save location",
        "Something went wrong. Please try again.",
      );
    } finally {
      isMutatingRef.current = false;
    }
  }, [location, savedLocationId, tripType]);

  const unsave = useCallback(async () => {
    if (isMutatingRef.current || savedLocationId === null) {
      return;
    }

    const idToDelete = savedLocationId;
    isMutatingRef.current = true;
    try {
      const response = await deleteSavedLocation(idToDelete);
      if (!response.ok) {
        throw new Error("Failed to remove saved location");
      }
      setSavedLocationId(null);
    } catch (error) {
      console.error("useSaveLocation: unsave failed", error);
      Alert.alert(
        "Could not remove location",
        "Something went wrong. Please try again.",
      );
    } finally {
      isMutatingRef.current = false;
    }
  }, [savedLocationId]);

  return {
    isSaved: savedLocationId !== null,
    isInitializing,
    save,
    unsave,
  };
}