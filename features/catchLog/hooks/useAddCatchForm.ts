import { useState, Dispatch, SetStateAction } from "react";
import { CatchEntry, CatchTime, WaterType, InputError } from "../../../types";

export default function useAddCatchForm(
  addNewCatch: (newCatch: CatchEntry) => void,
  time: CatchTime,
  setIsNewCatchModalVisible: Dispatch<SetStateAction<boolean>>
) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [species, setSpecies] = useState("");
  const [waterType, setWaterType] = useState<WaterType>(WaterType.Freshwater);
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    setIsNewCatchModalVisible(false);
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
  };
}
