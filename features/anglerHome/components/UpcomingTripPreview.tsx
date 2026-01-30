import React from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Divider from "common/components/Divider";
import MapWindow from "common/components/MapWindow";
import { TempUnits, UserUnits } from "types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getWeatherIconName } from "common/utils/WeatherUtils";
import useUpcomingTrip from "common/hooks/useUpcomingTrip";

export default function UpcomingTripPreview() {
  const { isLoading, upcomingTrip, weather } = useUpcomingTrip();
  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!upcomingTrip) {
    return (
      <View>
        <Text
          style={[styles.heading, styles.centeredText, { paddingBottom: 4 }]}
        >
          No trips planned
        </Text>
        <Text style={styles.centeredText}>
          When you plan a trip, it’ll show up here with the forecast and prep
          tips.
        </Text>
      </View>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(upcomingTrip.date));
  let degreeSymbol = "\u00B0";

  const userUnits = UserUnits.Imperial;

  return (
    <View>
      <View style={styles.locationContainer}>
        <View style={styles.locationDescription}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.heading}>{upcomingTrip.location.name}</Text>
          <Divider />
          <View style={styles.weatherContainer}>
            <MaterialCommunityIcons
              name={getWeatherIconName(weather.condition)}
              size={25}
              color={"black"}
            />
            <Text>{`${weather.temp}${degreeSymbol}${
              userUnits === UserUnits.Imperial
                ? TempUnits.Fahrenheit
                : TempUnits.Celsius
            }`}</Text>
            <Text>{"|"}</Text>
            <Text>{weather.condition}</Text>
          </View>
        </View>
        <View style={styles.locationThumbnail}>
          <MapWindow
            selectedLocation={upcomingTrip.location.coordinates}
            isViewOnly
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: { flexDirection: "row" },
  locationDescription: { flex: 1 },
  locationThumbnail: { flex: 1, paddingLeft: 24 },
  date: { fontSize: 16, paddingBottom: 4 },
  heading: { fontSize: 16, fontWeight: "bold" },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
  },
  centeredText: { textAlign: "center" },
});
