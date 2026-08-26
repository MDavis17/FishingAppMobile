import { useCallback, useEffect, useState } from "react";
import { CatchEntry, WaterType, InputError } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import { useTripContext } from "features/tripPlanner/components/TripContext";

interface UseAddCatchFormOptions {
  addNewCatch: (tripId: number, newCatch: CatchEntry) => void | Promise<void>;
  onSuccess?: () => void;
  visible?: boolean;
}

export default function useAddCatchForm({
  addNewCatch,
  onSuccess,
  visible = false,
}: UseAddCatchFormOptions) {
  const navigation = useNavigation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [species, setSpecies] = useState("");
  const [bait, setBait] = useState("");
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const { trip } = useTripContext();

  const validateInputs = (): InputError | null => {
    if (!date) {
      return { inputId: "date", message: "Please select a valid catch date." };
    }
    if (!species.trim()) {
      return { inputId: "species", message: "Species cannot be empty." };
    }
    return null;
  };

  const onTimeChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate((prev) => {
        const updated = new Date(prev ?? selectedDate);
        updated.setHours(selectedDate.getHours());
        updated.setMinutes(selectedDate.getMinutes());
        updated.setSeconds(0);
        updated.setMilliseconds(0);
        return updated;
      });
      if (inputError?.inputId === "date") {
        setInputError(null);
      }
    }
  };

  const resetForm = useCallback(() => {
    setSpecies("");
    setBait("");
    setInputError(null);

    if (trip) {
      setSelectedLocation(trip.location.coordinates || currentLocation);
      setDate(new Date(trip.date));
    } else if (currentLocation) {
      setSelectedLocation(currentLocation);
      setDate(new Date());
    }
  }, [trip, currentLocation]);

  const handleAddCatch = async () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!date || !selectedLocation) {
      return;
    }

    const newCatch: CatchEntry = {
      dateTime: date.toISOString(),
      species,
      waterType: trip?.waterType || WaterType.Freshwater,
      location: { coordinates: selectedLocation, name: "" },
      bait,
    };

    if (!trip) {
      console.warn("No trip context available");
      return;
    }

    await addNewCatch(trip.id, newCatch);
    resetForm();
    onSuccess?.();
  };

  const handleSelectNewLocation = () => {
    if (!selectedLocation) {
      return;
    }

    navigation.navigate("SelectLocation", {
      initialLocation: selectedLocation,
      onLocationSelected: (newLocation: LatLng) => {
        setSelectedLocation(newLocation);
      },
    });
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible, resetForm]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const currentLatLong = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setCurrentLocation(currentLatLong);

      const now = new Date();

      if (!trip) {
        setSelectedLocation(currentLatLong);
        setDate(now);
        return;
      }

      setSelectedLocation(trip.location.coordinates || currentLatLong);
      setDate(new Date(trip.date));
    })();
  }, [visible, trip]);

  return {
    bait,
    setBait,
    species,
    setSpecies,
    date,
    onTimeChange,
    inputError,
    setInputError,
    handleAddCatch,
    selectedLocation,
    setSelectedLocation,
    currentLocation,
    handleSelectNewLocation,
  };
}
