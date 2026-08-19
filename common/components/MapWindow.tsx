import React, { useEffect, useMemo, useRef } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Polygon,
  Region,
} from "react-native-maps";
import CustomPlacesInput from "./CustomPlacesInput";
import { useTheme } from "react-native-paper";
import { RangeData } from "types";

const DEFAULT_REGION: Region = {
  latitude: 39.8283,
  longitude: -98.5795,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export interface MapPin {
  coordinate: LatLng;
  title?: string;
}

interface Props {
  height?: number | string;
  width?: number | string;
  selectedLocation?: LatLng;
  pins?: MapPin[] | LatLng[];
  latDelta?: number;
  lngDelta?: number;
  onLocationSelect?: (newLocation: LatLng) => void;
  isViewOnly?: boolean;
  rangeData?: RangeData;
  animationDuration?: number;
}

function normalizePins(pins?: MapPin[] | LatLng[]): MapPin[] {
  if (!pins?.length) return [];
  return pins.map((pin) =>
    "latitude" in pin && "longitude" in pin && !("coordinate" in pin)
      ? { coordinate: pin as LatLng }
      : (pin as MapPin),
  );
}

export default function MapWindow({
  height = "100%",
  width = "100%",
  selectedLocation,
  pins: pinsProp,
  latDelta = 0.0922,
  lngDelta = 0.0421,
  onLocationSelect,
  isViewOnly = false,
  rangeData,
  animationDuration = 500,
}: Props) {
  const mapRef = useRef<MapView | null>(null);
  const theme = useTheme();
  const pins = useMemo(() => normalizePins(pinsProp), [pinsProp]);

  const initialSelectedLocationRegion = useMemo((): Region | null => {
    if (!selectedLocation) return null;
    return {
      ...selectedLocation,
      latitudeDelta: latDelta ?? 0.0922,
      longitudeDelta: lngDelta ?? 0.0421,
    };
  }, [selectedLocation, latDelta, lngDelta]);

  const initialRangeDataRegion = useMemo((): Region | null => {
    if (
      !rangeData ||
      typeof rangeData.centerLatitude !== "number" ||
      typeof rangeData.centerLongitude !== "number"
    ) {
      return null;
    }
    return {
      latitude: rangeData.centerLatitude,
      longitude: rangeData.centerLongitude,
      latitudeDelta: rangeData.latDelta ?? 0.0922,
      longitudeDelta: rangeData.lngDelta ?? 0.0421,
    };
  }, [rangeData]);

  const initialRegion = useMemo(() => {
    if (initialRangeDataRegion) return initialRangeDataRegion;
    if (initialSelectedLocationRegion) return initialSelectedLocationRegion;
    if (pins.length > 0) {
      const first = pins[0].coordinate;
      return {
        ...first,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };
    }
    return DEFAULT_REGION;
  }, [
    initialRangeDataRegion,
    initialSelectedLocationRegion,
    pins,
    latDelta,
    lngDelta,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (rangeData && typeof rangeData.centerLatitude === "number") {
      map.animateToRegion(
        {
          latitude: rangeData.centerLatitude,
          longitude: rangeData.centerLongitude,
          latitudeDelta: rangeData.latDelta ?? 0.0922,
          longitudeDelta: rangeData.lngDelta ?? 0.0421,
        },
        animationDuration,
      );
      return;
    }

    if (selectedLocation) {
      map.animateToRegion(
        {
          ...selectedLocation,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        },
        animationDuration,
      );
      return;
    }

    if (pins.length > 0) {
      const coordinates = pins.map((p) => p.coordinate);
      map.fitToCoordinates(coordinates, {
        edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
        animated: true,
      });
    }
  }, [
    rangeData,
    selectedLocation,
    pins,
    latDelta,
    lngDelta,
    animationDuration,
  ]);

  const handleSetNewLocation = (event: MapPressEvent) => {
    if (isViewOnly || !onLocationSelect) {
      return;
    }
    onLocationSelect(event.nativeEvent.coordinate);
  };

  const getPolygonFillColor = (occurrenceProbability: number) => {
    if (occurrenceProbability < 0.33) {
      return "rgba(255, 255, 0, 0.25)";
    } else if (occurrenceProbability < 0.66) {
      return "rgba(255, 125, 0, 0.25)";
    } else {
      return "rgba(255, 0, 0, 0.33)";
    }
  };

  return (
    <View style={styles.container}>
      {!isViewOnly && onLocationSelect && (
        <CustomPlacesInput onLocationSelect={onLocationSelect} />
      )}

      <MapView
        ref={mapRef}
        style={{
          width: width as DimensionValue,
          height: height as DimensionValue,
        }}
        initialRegion={initialRegion}
        scrollEnabled={!isViewOnly}
        zoomEnabled={!isViewOnly}
        pitchEnabled={!isViewOnly}
        rotateEnabled={!isViewOnly}
        onPress={handleSetNewLocation}
      >
        {rangeData?.polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            fillColor={getPolygonFillColor(polygon.occurrenceProbability)}
          />
        ))}
        {pins.map((pin, index) => (
          <Marker
            key={index}
            coordinate={pin.coordinate}
            title={pin.title}
            pinColor={theme.colors.tertiary}
          />
        ))}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor={theme.colors.secondary}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
});
