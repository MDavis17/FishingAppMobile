import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import { InputError, RootStackParamList, Species } from "types";
import { addNewTrip, CreateTripPayload } from "../api/addNewTrip";

export default function useNewTripForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<CreateTripPayload["status"]>("Planned");
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationName, setLocationName] = useState("");
  const [targetSpecies, setTargetSpecies] = useState<Species[]>([]);
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const validateInputs = (): InputError | null => {
    if (!selectedLocation) {
      return {
        inputId: "location",
        message: "Please select a trip location.",
      };
    }

    if (!locationName.trim()) {
      return {
        inputId: "locationName",
        message: "Please give your trip location a name.",
      };
    }

    if (!date) {
      return { inputId: "date", message: "Please select a valid trip date." };
    }

    return null;
  };

  const onDateTimeChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (inputError?.inputId === "date") {
        setInputError(null);
      }
    }
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

  const handleSave = async () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!selectedLocation || !date) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await addNewTrip({
        date: date.toISOString(),
        location: {
          coordinates: selectedLocation,
          name: locationName.trim(),
        },
        status,
        targetSpecies: targetSpecies.map(({ id, name }) => ({ id, name })),
      });

      if (!response.ok) {
        throw new Error("Failed to save trip");
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving trip:", error);
      setSaveError("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coordinates = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setCurrentLocation(coordinates);
      setSelectedLocation(coordinates);
    })();
  }, []);

  return {
    date,
    status,
    setStatus,
    onDateTimeChange,
    selectedLocation,
    setSelectedLocation,
    currentLocation,
    locationName,
    setLocationName,
    targetSpecies,
    setTargetSpecies,
    inputError,
    setInputError,
    handleSelectNewLocation,
    handleSave,
    isSaving,
    saveError,
  };
}
