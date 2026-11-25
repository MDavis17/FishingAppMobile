import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "common/components/Card";
import LocationMapThumbnail from "common/components/LocationMapThumbnail";
import { deleteSavedLocation } from "features/tripPlanner/api/deleteSavedLocation";
import { TRIP_TYPE_ICONS } from "features/tripPlanner/constants";
import {
  navigateToNewTripWithPreset,
  presetFromSavedLocation,
} from "features/tripPlanner/navigation/navigateToNewTrip";
import { notifySavedLocationChange } from "features/tripPlanner/savedLocationSync";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { IconButton, Menu, Text, useTheme } from "react-native-paper";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { SavedLocation, TripType } from "types";

interface Props {
  savedLocation: SavedLocation;
  onDeleted: (id: number) => void;
  onDeleteFailed: (location: SavedLocation) => void;
}

export default function SavedLocationListItem({
  savedLocation,
  onDeleted,
  onDeleteFailed,
}: Props) {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [menuOpen, setMenuOpen] = useState(false);

  const { location, tripType } = savedLocation;
  const latitude = location.coordinates.latitude;
  const longitude = location.coordinates.longitude;
  const latitudeDirection = latitude > 0 ? "N" : "S";
  const longitudeDirection = longitude > 0 ? "E" : "W";
  const badgeIcon =
    tripType != null ? TRIP_TYPE_ICONS[tripType as TripType] : undefined;

  const confirmDelete = () => {
    Alert.alert(
      "Delete this location?",
      "This spot will be removed from your saved locations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void handleDelete();
          },
        },
      ],
    );
  };

  const handleDelete = async () => {
    onDeleted(savedLocation.id);
    try {
      const response = await deleteSavedLocation(savedLocation.id);
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      notifySavedLocationChange({
        tripId: -1,
        savedLocationId: null,
        coordinates: location.coordinates,
      });
    } catch (error) {
      console.error("SavedLocationListItem: delete failed", error);
      onDeleteFailed(savedLocation);
      Alert.alert(
        "Could not delete location",
        "Something went wrong. Please try again.",
      );
    }
  };

  const handlePlanTrip = () => {
    setMenuOpen(false);
    navigateToNewTripWithPreset(
      navigation,
      presetFromSavedLocation(savedLocation),
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <LocationMapThumbnail
          coordinates={location.coordinates}
          badgeIcon={badgeIcon}
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
            {`${latitude.toFixed(3)}° ${latitudeDirection}, ${longitude.toFixed(3)}° ${longitudeDirection}`}
          </Text>
          {location.generalLocationName ? (
            <View style={styles.cityRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
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
        {/* TODO: add fish icon when adding catch updates saved location catch status */}
        {/* <View style={styles.fishContainer}>
          <MaterialCommunityIcons
            name={didCatchFishHere ? "fish" : "fish-off"}
            size={22}
            color={theme.colors.primary}
          />
        </View> */}
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              accessibilityLabel="Location options"
              onPress={() => setMenuOpen(true)}
            />
          }
        >
          <Menu.Item
            onPress={handlePlanTrip}
            title="Plan a trip at this location"
          />
          <Menu.Item
            onPress={() => {
              setMenuOpen(false);
              confirmDelete();
            }}
            title="Delete this location"
          />
        </Menu>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 10,
    gap: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fishContainer: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
