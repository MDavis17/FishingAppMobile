import React, { useMemo } from "react";
import { Icon, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { TempUnits, Trip, TripType, UserUnits } from "types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getWeatherIconName } from "common/utils/WeatherUtils";
import LocationMapThumbnail from "common/components/LocationMapThumbnail";
import TripStatusChip from "./TripStatusChip";
import { format } from "date-fns";
import { TRIP_TYPE_ICONS } from "../constants";

interface Props {
  trip: Trip;
}

export default function TripPreview({ trip }: Props) {
  const theme = useTheme();
  const mockWeather = { temp: 72, condition: "Sunny" };
  const weather = mockWeather;
  const tripDate = new Date(trip.date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(tripDate);
  let degreeSymbol = "\u00B0";
  const formattedStartTime = format(tripDate, "h:mm aaa");

  const userUnits = UserUnits.Imperial;
  const isTripCompleted = trip.status === "Completed";

  const weatherPreview = useMemo(() => {
    return (
      <View style={styles.weatherContainer}>
        <MaterialCommunityIcons
          name={getWeatherIconName(weather.condition)}
          size={25}
          color={theme.colors.primary}
        />
        <Text>{`${weather.temp}${degreeSymbol}${
          userUnits === UserUnits.Imperial
            ? TempUnits.Fahrenheit
            : TempUnits.Celsius
        }`}</Text>
        <Text>{"|"}</Text>
        <Text>{weather.condition}</Text>
      </View>
    );
  }, [weather]);

  return (
    <View style={styles.container}>
      <LocationMapThumbnail
        coordinates={trip.location.coordinates}
        badgeIcon={TRIP_TYPE_ICONS[trip.tripType as TripType]}
        overlay={<TripStatusChip status={trip.status} />}
      />
      <View style={styles.descriptionContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{trip.location.name}</Text>
          {trip.savedLocationId != null && (
            <MaterialCommunityIcons
              name="bookmark"
              size={18}
              color={theme.colors.primary}
            />
          )}
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Icon source="calendar" size={24} color={theme.colors.primary} />
            <Text variant="bodyMedium">{formattedDate}</Text>
          </View>
          <View style={styles.statsItem}>
            <Icon source="clock" size={24} color={theme.colors.primary} />
            <Text variant="bodyMedium">{formattedStartTime}</Text>
          </View>
          <View style={styles.statsItem}>
            {isTripCompleted ? (
              <View style={styles.statsItem}>
                <Icon source={"fish"} size={24} color={theme.colors.primary} />
                <Text>{trip.catchList.length} catches</Text>
              </View>
            ) : (
              weatherPreview
            )}
          </View>
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.onSurface}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 12 },
  descriptionContainer: {
    flex: 1,
    gap: 4,
    paddingVertical: 4,
  },
  chevronContainer: { alignItems: "center", justifyContent: "center" },
  statsContainer: { gap: 4 },
  statsItem: { flexDirection: "row", gap: 8 },
  date: { fontSize: 16, paddingBottom: 4 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  title: { fontSize: 16, fontWeight: "bold" },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
  },
  centeredText: { textAlign: "center" },
});
