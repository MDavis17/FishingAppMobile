import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { WeatherConditions } from "common/api/marineApi";

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatTime(isoish: string | null): string {
  if (!isoish) return "—";
  // Open-Meteo returns "YYYY-MM-DDTHH:MM" — parse just the time portion
  const timePart = isoish.includes("T") ? isoish.split("T")[1] : isoish;
  if (!timePart) return isoish;
  const [hStr, mStr] = timePart.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface Props {
  weather: WeatherConditions | null;
  isLoading: boolean;
}

export default function WeatherCard({ weather, isLoading }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Weather
        </Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
        ) : !weather ? (
          <Text style={[styles.unavailable, { color: theme.colors.onSurface }]}>Data unavailable</Text>
        ) : (
          <>
            <View style={styles.row}>
              <DataItem
                label="Air Temp"
                value={weather.air_temp_f != null ? `${weather.air_temp_f}°F` : "—"}
              />
              <DataItem
                label="Rain"
                value={weather.precipitation_in != null ? `${weather.precipitation_in}"` : "—"}
              />
            </View>
            <View style={styles.row}>
              <DataItem
                label="Wind"
                value={
                  weather.wind_speed_mph != null
                    ? `${weather.wind_speed_mph} mph ${weather.wind_direction_deg != null ? degreesToCardinal(weather.wind_direction_deg) : ""}`
                    : "—"
                }
              />
              <DataItem
                label="Gusts"
                value={weather.wind_gusts_mph != null ? `${weather.wind_gusts_mph} mph` : "—"}
              />
            </View>
            <View style={styles.row}>
              <DataItem label="Sunrise" value={formatTime(weather.sunrise)} />
              <DataItem label="Sunset" value={formatTime(weather.sunset)} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.dataItem}>
      <Text style={[styles.dataLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.dataValue, { color: theme.colors.onSurface }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    elevation: 2,
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 11,
    marginBottom: 1,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 13,
  },
  unavailable: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
