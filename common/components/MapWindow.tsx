import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { LatLng, MapPressEvent, Marker } from "react-native-maps";
import CustomPlacesInput from "./CustomPlacesInput";
import { useTheme } from "react-native-paper";

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
  const theme = useTheme();

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.animateToRegion(
        {
          ...selectedLocation,
          latitudeDelta: mapRef.current.context.latitudeDelta,
          longitudeDelta: mapRef.current.context.latitudeDelta,
        },
        500
      );
    }
  }, [selectedLocation]);

  const handleSetNewLocation = (event: MapPressEvent) => {
    if (isViewOnly || !onLocationSelect) {
      return;
    }
    onLocationSelect(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.container}>
      {!isViewOnly && onLocationSelect && (
        <CustomPlacesInput onLocationSelect={onLocationSelect} />
      )}

      <MapView
        ref={mapRef}
        style={{ width, height }}
        initialRegion={{
          ...selectedLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={!isViewOnly}
        zoomEnabled={!isViewOnly}
        pitchEnabled={!isViewOnly}
        rotateEnabled={!isViewOnly}
        onPress={handleSetNewLocation}
      >
        <Marker
          coordinate={selectedLocation}
          pinColor={theme.colors.secondary}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
});
