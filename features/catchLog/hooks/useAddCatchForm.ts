import { useState } from "react";
import { CatchEntry, CatchTime, WaterType, InputError } from "../../../types";
import { useNavigation } from "@react-navigation/native";

export default function useAddCatchForm(
  time: CatchTime,
  addNewCatch: (newCatch: CatchEntry) => void
) {
  const navigation = useNavigation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [species, setSpecies] = useState("");
  const [waterType, setWaterType] = useState<WaterType>(WaterType.Freshwater);
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

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
    navigation.goBack();
  };

  const handleAddCatch = () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!date) {
      return;
    }

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.hours);
    combinedDateTime.setMinutes(time.minutes);

    const newCatch: CatchEntry = {
      dateTime: combinedDateTime.toISOString(),
      species,
      waterType,
    };

    addNewCatch(newCatch);
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
  };
}
