import { useEffect, useState } from "react";
import { WaterType, InputError, Trip } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";

export default function useNewTripForm(addNewTrip: (newTrip: Trip) => void) {
  const navigation = useNavigation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [waterType, setWaterType] = useState<WaterType>(WaterType.Freshwater);
  const [inputError, setInputError] = useState<InputError | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  const validateInputs = (): InputError | null => {
    if (!date) {
      return { inputId: "date", message: "Please select a valid trip date." };
    }
    return null;
  };

  const resetForm = () => {
    setWaterType(WaterType.Freshwater);
    setSelectedLocation(currentLocation);
    navigation.goBack();
  };

  const handleAddTrip = () => {
    const error = validateInputs();
    if (error) {
      setInputError(error);
      return;
    }

    if (!date || !selectedLocation) {
      return;
    }

    const newTrip: Trip = {
      date: date.toISOString(),
      waterType,
      location: selectedLocation,
      catchList: [],
    };

    addNewTrip(newTrip);
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
    waterType,
    setWaterType,
    inputError,
    setInputError,
    handleAddTrip,
    selectedLocation,
    setSelectedLocation,
    handleSelectNewLocation,
    currentLocation,
  };
}
