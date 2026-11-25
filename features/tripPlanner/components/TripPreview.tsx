import React, { useMemo } from "react";
import { Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { TempUnits, Trip, TripType, UserUnits } from "types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getWeatherIconName } from "common/utils/WeatherUtils";
import LocationMapThumbnail from "common/components/LocationMapThumbnail";
import TripStatusChip from "./TripStatusChip";
import PreviewStatsItem from "./PreviewStatsItem";
import { format } from "date-fns";
import { TRIP_TYPE_ICONS } from "../constants";

interface Props {
  trip: Trip;
}

function outsideForecastLabel(daysUntilForecast: number): string {
  if (daysUntilForecast <= 1) {
    return "view forecast tomorrow";
  }
  return `view forecast in ${daysUntilForecast} days`;
}

export default function TripPreview({ trip }: Props) {
  const theme = useTheme();
  const tripDate = new Date(trip.date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(tripDate);
  const degreeSymbol = "\u00B0";
  const formattedStartTime = format(tripDate, "h:mm aaa");

  const userUnits = UserUnits.Imperial;
  const isTripCompleted = trip.status === "Completed";
  const catchCount = trip.catchList.length;
  const personalBestCount = trip.personalBestCount ?? 0;

  const weatherPreview = useMemo(() => {
    const preview = trip.weatherPreview;
    if (!preview) {
      return null;
    }

    if (preview.status === "outside_window") {
      return (
        <PreviewStatsItem
          label={outsideForecastLabel(preview.daysUntilForecast ?? 1)}
        />
      );
    }

    if (preview.status !== "ready") {
      return null;
    }

    const airTempF = preview.airTempF;
    const description = preview.weatherDescription;
    if (airTempF == null || !description) {
      return null;
    }

    return (
      <PreviewStatsItem
        leading={
          <MaterialCommunityIcons
            name={getWeatherIconName(description)}
            size={24}
            color={theme.colors.primary}
          />
        }
      >
        <View style={styles.weatherTextRow}>
          <Text variant="bodyMedium">{`${Math.round(airTempF)}${degreeSymbol}${
            userUnits === UserUnits.Imperial
              ? TempUnits.Fahrenheit
              : TempUnits.Celsius
          }`}</Text>
          <Text variant="bodyMedium">|</Text>
          <Text variant="bodyMedium">{description}</Text>
        </View>
      </PreviewStatsItem>
    );
  }, [degreeSymbol, theme.colors.primary, trip.weatherPreview, userUnits]);

  const catchSummaryPreview = useMemo(() => {
    if (catchCount === 0) {
      return (
        <PreviewStatsItem icon="fish-off" accessibilityLabel="No catches" />
      );
    }

    return (
      <View style={styles.catchStatsRow}>
        <PreviewStatsItem
          icon="fish"
          label={String(catchCount)}
          accessibilityLabel={`${catchCount} catches`}
        />
        {personalBestCount > 0 ? (
          <PreviewStatsItem
            icon="trophy"
            label={String(personalBestCount)}
            accessibilityLabel={`${personalBestCount} personal bests`}
          />
        ) : null}
      </View>
    );
  }, [catchCount, personalBestCount]);

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
          <PreviewStatsItem icon="calendar" label={formattedDate} />
          <PreviewStatsItem icon="clock" label={formattedStartTime} />
          {isTripCompleted ? catchSummaryPreview : weatherPreview}
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
  catchStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  title: { fontSize: 16, fontWeight: "bold" },
});
