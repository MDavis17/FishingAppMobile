import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "types";
import MapWindow from "common/components/MapWindow";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LatLng } from "react-native-maps";
import { Button } from "react-native-paper";

type SelectLocationRouteProp = RouteProp<RootStackParamList, "SelectLocation">;

export default function SelectLocation() {
  const navigation = useNavigation();
  const route = useRoute<SelectLocationRouteProp>();
  const { initialLocation, onLocationSelected } = route.params;

  const [location, setLocation] = useState<LatLng>(initialLocation);

  const handlePress = (newLoc: LatLng) => {
    setLocation(newLoc);
  };

  const handleConfirm = () => {
    onLocationSelected?.(location);
    navigation.goBack();
  };

  return (
    <View style={styles.flexContainer}>
      <MapWindow selectedLocation={location} onLocationSelect={handlePress} />
      {location !== initialLocation && (
        <View style={styles.confirmButton}>
          <Button
            mode="contained"
            style={{ opacity: 0.9 }}
            textColor="white"
            onPress={handleConfirm}
          >
            Confirm
          </Button>
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
});
