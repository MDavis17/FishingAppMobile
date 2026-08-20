import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import { InputError, RootStackParamList, Species, Trip } from "types";

export default function usePlanTripForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationName, setLocationName] = useState("");
  const [targetSpecies, setTargetSpecies] = useState<Species[]>([]);
  const [inputError, setInputError] = useState<InputError | null>(null);

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

    return null;
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

  const handleSave = () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!selectedLocation) {
      return;
    }

    const plannedTrip: Trip = {
      id: 0,
      date: new Date().toISOString(),
      location: {
        coordinates: selectedLocation,
        name: locationName.trim(),
      },
      catchList: [],
      catchSummary: "",
      status: "Planned",
      targetSpecies,
    };

    console.log("Planned trip (UI only):", plannedTrip);
    navigation.goBack();
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
  };
}
