import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "common/components/Card";
import LocationMapThumbnail from "common/components/LocationMapThumbnail";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { SavedLocation } from "types";

interface Props {
  savedLocation: SavedLocation;
  selected: boolean;
  onPress: () => void;
}

export default function SavedLocationPickerListItem({
  savedLocation,
  selected,
  onPress,
}: Props) {
  const theme = useTheme();
  const { location } = savedLocation;
  const { latitude, longitude } = location.coordinates;
  const latitudeDirection = latitude >= 0 ? "N" : "S";
  const longitudeDirection = longitude >= 0 ? "E" : "W";

  const borderColor = selected ? theme.colors.primary : "transparent";

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card
        style={[
          styles.card,
          {
            borderWidth: selected ? 1.5 : 0,
            borderColor,
          },
        ]}
      >
        <LocationMapThumbnail
          coordinates={location.coordinates}
          style={styles.thumbnail}
        />
        <View style={styles.textContainer}>
          <Text
            style={[styles.name, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {location.name}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {`${latitude.toFixed(4)}° ${latitudeDirection}, ${longitude.toFixed(4)}° ${longitudeDirection}`}
          </Text>
          {location.generalLocationName ? (
            <View style={styles.cityRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
                numberOfLines={1}
              >
                {location.generalLocationName}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.checkContainer}>
          {selected ? (
            <Icon
              source="check-circle"
              size={26}
              color={theme.colors.primary}
            />
          ) : (
            <View
              style={[
                styles.emptyCircle,
                { borderColor: theme.colors.outlineVariant },
              ]}
            />
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    marginHorizontal: 16,
  },
  thumbnail: {
    width: 56,
    aspectRatio: 1,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  checkContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
