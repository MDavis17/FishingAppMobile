import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LocationSelection, RootStackParamList } from "types";
import MapWindow from "common/components/MapWindow";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import PrimaryButton from "./buttons/PrimaryButton";

type SelectLocationRouteProp = RouteProp<RootStackParamList, "SelectLocation">;

export default function SelectLocation() {
  const navigation = useNavigation();
  const route = useRoute<SelectLocationRouteProp>();
  const { initialLocation, onLocationSelected } = route.params;

  const [selection, setSelection] = useState<LocationSelection>({
    coordinates: initialLocation,
  });

  const handlePress = (newSelection: LocationSelection) => {
    setSelection(newSelection);
  };

  const handleConfirm = () => {
    onLocationSelected?.(selection);
    navigation.goBack();
  };

  const coordsChanged =
    selection.coordinates.latitude !== initialLocation.latitude ||
    selection.coordinates.longitude !== initialLocation.longitude;
  const hasPlaceSelection =
    selection.placeName != null || selection.generalLocationName != null;
  const showConfirm = coordsChanged || hasPlaceSelection;

  return (
    <View style={styles.flexContainer}>
      <MapWindow
        selectedLocation={selection.coordinates}
        onLocationSelect={handlePress}
      />
      {showConfirm && (
        <View style={styles.confirmButton}>
          <PrimaryButton onPress={handleConfirm}>Confirm</PrimaryButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: { flex: 1 },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  button: {
    opacity: 0.9,
  },
});
