import { useEffect, useState } from "react";
import { CatchEntry, CatchTime, WaterType, InputError } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";

export default function useAddCatchForm(
  time: CatchTime,
  tripId: number,
  addNewCatch: (tripId: number, newCatch: CatchEntry) => void
) {
  const navigation = useNavigation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [species, setSpecies] = useState("");
  const [waterType, setWaterType] = useState<WaterType>(WaterType.Freshwater);
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  const validateInputs = (): InputError | null => {
    if (!date) {
      return { inputId: "date", message: "Please select a valid catch date." };
    }
    if (!species.trim()) {
      return { inputId: "species", message: "Species cannot be empty." };
    }
    return null;
  };

  const resetForm = () => {
    setSpecies("");
    setWaterType(WaterType.Freshwater);
    setSelectedLocation(currentLocation);
    navigation.goBack();
  };

  const handleAddCatch = () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!date || !selectedLocation) {
      return;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.hours);
    combinedDateTime.setMinutes(time.minutes);

    const newCatch: CatchEntry = {
      dateTime: combinedDateTime.toISOString(),
      species,
      waterType,
      location: { coordinates: selectedLocation, name: "" },
    };

    addNewCatch(tripId, newCatch);
    resetForm();
  };

  const handleSelectNewLocation = () => {
    navigation.navigate("SelectLocation", {
      initialLocation: selectedLocation,
      onLocationSelected: (newLocation: LatLng) => {
        setSelectedLocation(newLocation);
      },
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setSelectedLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return {
    date,
    setDate,
    species,
    setSpecies,
    waterType,
    setWaterType,
    inputError,
    setInputError,
    handleAddCatch,
    selectedLocation,
    setSelectedLocation,
    handleSelectNewLocation,
    currentLocation,
  };
}
