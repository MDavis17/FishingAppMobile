import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useLocation } from "common/context/LocationContext";
import useHeaderWeather from "common/hooks/useHeaderWeather";
import LocationSearchModal from "./LocationSearchModal";

export default function AppHeader() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { location } = useLocation();
  const { temperature, isLoading: isWeatherLoading } = useHeaderWeather(location);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.primary,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.locationSection}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.colors.onPrimary}
          />
          <Text
            style={[styles.locationText, { color: theme.colors.onPrimary }]}
            numberOfLines={1}
          >
            {location ? location.name : "Select Location"}
          </Text>
        </TouchableOpacity>

        <View style={styles.weatherSection}>
          {isWeatherLoading ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : temperature !== null ? (
            <Text style={[styles.temperatureText, { color: theme.colors.onPrimary }]}>
              {Math.round(temperature)}°F
            </Text>
          ) : null}
        </View>
      </View>

      <LocationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
    marginRight: 12,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "500",
    flexShrink: 1,
  },
  weatherSection: {
    alignItems: "flex-end",
  },
  temperatureText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
