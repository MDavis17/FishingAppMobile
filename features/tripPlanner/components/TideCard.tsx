import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { TideData, TidePrediction } from "common/api/marineApi";

function formatTideTime(raw: string): string {
  // NOAA returns "YYYY-MM-DD HH:MM"
  const parts = raw.split(" ");
  if (parts.length < 2) return raw;
  const [hStr, mStr] = parts[1].split(":");
  const h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  // Trim the date to just show day
  const datePart = parts[0];
  const today = new Date().toISOString().split("T")[0];
  const label = datePart === today ? "Today" : datePart.slice(5); // "MM-DD"
  return `${label} ${h12}:${m} ${ampm}`;
}

interface Props {
  tides: TideData | null;
  isLoading: boolean;
}

export default function TideCard({ tides, isLoading }: Props) {
  const theme = useTheme();

  // Show next 4 tide events
  const upcoming = tides?.predictions?.slice(0, 4) ?? [];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Tides{tides ? ` — ${tides.station_name}` : ""}
        </Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
        ) : !tides || upcoming.length === 0 ? (
          <Text style={[styles.unavailable, { color: theme.colors.onSurface }]}>Data unavailable</Text>
        ) : (
          <View style={styles.tideGrid}>
            {upcoming.map((p: TidePrediction, i: number) => (
              <View key={i} style={styles.tideItem}>
                <Text style={[styles.tideType, {
                  color: p.type === "H" ? theme.colors.primary : theme.colors.onSurfaceVariant
                }]}>
                  {p.type === "H" ? "High" : "Low"}
                </Text>
                <Text style={[styles.tideHeight, { color: theme.colors.onSurface }]}>
                  {p.height_ft} ft
                </Text>
                <Text style={[styles.tideTime, { color: theme.colors.onSurfaceVariant }]}>
                  {formatTideTime(p.time)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
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
  tideGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tideItem: {
    width: "50%",
    marginBottom: 8,
  },
  tideType: {
    fontSize: 11,
    fontWeight: "600",
  },
  tideHeight: {
    fontSize: 15,
    fontWeight: "bold",
  },
  tideTime: {
    fontSize: 11,
    marginTop: 1,
  },
  loadingText: {
    fontSize: 13,
  },
  unavailable: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
