import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
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
    <View>
      <MapWindow selectedLocation={location} onLocationSelect={handlePress} />
      {location !== initialLocation && (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}
        >
          <Button
            style={{ backgroundColor: "blue", opacity: 0.9 }}
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

const styles = StyleSheet.create({});
