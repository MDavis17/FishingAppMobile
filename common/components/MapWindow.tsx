import React from "react";
import MapView, { LatLng, Marker } from "react-native-maps";

interface Props {
  height?: number;
  width?: number | string;
  selectedLocation: LatLng | null;
  setSelectedLocation: (location: LatLng) => void;
}

export default function MapWindow({
  height = 200,
  width = "100%",
  selectedLocation,
  setSelectedLocation,
}: Props) {
  return (
    <MapView
      style={{ width, height }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
    >
      {selectedLocation && <Marker coordinate={selectedLocation} />}
    </MapView>
  );
}
