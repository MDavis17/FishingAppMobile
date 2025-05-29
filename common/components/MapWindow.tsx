import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { LatLng, MapPressEvent, Marker } from "react-native-maps";

interface Props {
  height?: number | string;
  width?: number | string;
  selectedLocation: LatLng;
  onLocationSelect?: (newLocation: LatLng) => void;
  isViewOnly?: boolean;
}

export default function MapWindow({
  height = "100%",
  width = "100%",
  selectedLocation,
  onLocationSelect,
  isViewOnly = false,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  const mapViewRegion = {
    ...selectedLocation,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.animateToRegion(mapViewRegion, 1000);
    }
  }, [selectedLocation]);

  const handleSetNewLocation = (event: MapPressEvent) => {
    if (isViewOnly || !onLocationSelect) {
      return;
    }
    onLocationSelect(event.nativeEvent.coordinate);
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        style={{ width, height }}
        initialRegion={mapViewRegion}
        scrollEnabled={!isViewOnly}
        zoomEnabled={!isViewOnly}
        pitchEnabled={!isViewOnly}
        rotateEnabled={!isViewOnly}
        onPress={handleSetNewLocation}
      >
        <Marker coordinate={selectedLocation} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
});
