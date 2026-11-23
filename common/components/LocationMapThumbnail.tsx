import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Icon, useTheme } from "react-native-paper";
import { LatLng } from "react-native-maps";
import MapWindow from "./MapWindow";

interface Props {
  coordinates: LatLng;
  badgeIcon?: string;
  overlay?: React.ReactNode;
  style?: ViewStyle;
}

export default function LocationMapThumbnail({
  coordinates,
  badgeIcon,
  overlay,
  style,
}: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.mapContainer, style]}>
      <MapWindow selectedLocation={coordinates} isViewOnly />
      {(badgeIcon != null || overlay != null) && (
        <View style={styles.overlayContainer} pointerEvents="box-none">
          {badgeIcon != null ? (
            <View
              style={[
                styles.badgeContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Icon
                source={badgeIcon}
                size={24}
                color={theme.colors.onPrimary}
              />
            </View>
          ) : null}
          {overlay}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: 130,
    aspectRatio: 1.25,
    borderRadius: 8,
    overflow: "hidden",
  },
  overlayContainer: {
    position: "absolute",
    padding: 4,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 4,
  },
  badgeContainer: {
    borderRadius: 8,
    overflow: "hidden",
    padding: 4,
  },
});
