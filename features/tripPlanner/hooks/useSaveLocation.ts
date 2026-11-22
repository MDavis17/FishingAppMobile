import { deleteSavedLocation } from "features/tripPlanner/api/deleteSavedLocation";
import { saveLocation } from "features/tripPlanner/api/saveLocation";
import { settleSavedLocationChange } from "features/tripPlanner/savedLocationSync";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Location, SavedLocation, TripType } from "types";

type SaveLocationResponse = {
  message?: string;
  location?: SavedLocation;
};

export default function useSaveLocation(
  location: Location,
  tripType: TripType,
  initialSavedLocationId: number | null | undefined,
  tripId?: number,
) {
  const [savedLocationId, setSavedLocationId] = useState<number | null>(
    initialSavedLocationId ?? null,
  );
  const isMutatingRef = useRef(false);
  const skipPropSync = useRef(false);

  useEffect(() => {
    if (skipPropSync.current) {
      return;
    }
    setSavedLocationId(initialSavedLocationId ?? null);
  }, [initialSavedLocationId]);

  const save = useCallback(async () => {
    if (isMutatingRef.current || savedLocationId !== null) {
      return null;
    }

    isMutatingRef.current = true;
    try {
      const response = await saveLocation({
        location,
        didCatchFishHere: false,
        notes: null,
        tripType,
        tripId: tripId ?? null,
      });

      if (!response.ok) {
        throw new Error("Failed to save location");
      }

      const data = response.data as SaveLocationResponse;
      const id = data.location?.id;
      if (id === undefined) {
        throw new Error("Invalid save response");
      }
      skipPropSync.current = true;
      setSavedLocationId(id);
      return id;
    } catch (error) {
      console.error("useSaveLocation: save failed", error);
      Alert.alert(
        "Could not save location",
        "Something went wrong. Please try again.",
      );
      return null;
    } finally {
      isMutatingRef.current = false;
    }
  }, [location, savedLocationId, tripId, tripType]);

  const unsave = useCallback(
    async (
      locationId: number,
      onSavedStatusChange?: (savedLocationId: number | null) => void,
    ) => {
      if (isMutatingRef.current) {
        return false;
      }

      isMutatingRef.current = true;
      skipPropSync.current = true;
      setSavedLocationId(null);
      onSavedStatusChange?.(null);
      try {
        const response = await deleteSavedLocation(
          locationId,
          location.coordinates,
          tripId,
        );
        if (!response.ok) {
          throw new Error("Failed to remove saved location");
        }
        return true;
      } catch (error) {
        console.error("useSaveLocation: unsave failed", error);
        skipPropSync.current = true;
        setSavedLocationId(locationId);
        onSavedStatusChange?.(locationId);
        Alert.alert(
          "Could not remove location",
          "Something went wrong. Please try again.",
        );
        return false;
      } finally {
        isMutatingRef.current = false;
        settleSavedLocationChange();
      }
    },
    [location.coordinates, tripId],
  );

  return {
    isSaved: savedLocationId !== null,
    savedLocationId,
    save,
    unsave,
  };
}