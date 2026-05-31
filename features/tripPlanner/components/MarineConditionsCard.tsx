import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { MarineConditions } from "common/api/marineApi";

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

interface Props {
  conditions: MarineConditions | null;
  isLoading: boolean;
}

export default function MarineConditionsCard({ conditions, isLoading }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Ocean Conditions
        </Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Loading...
          </Text>
        ) : !conditions ? (
          <Text style={[styles.unavailable, { color: theme.colors.onSurface }]}>
            Data unavailable
          </Text>
        ) : (
          <>
            {conditions.nearest_station_name && (
              <Text style={[styles.stationLabel, { color: theme.colors.onSurfaceVariant }]}>
                Near {conditions.nearest_station_name}
              </Text>
            )}
            <View style={styles.row}>
              <DataItem
                label="Water Temp"
                value={conditions.water_temp_f != null ? `${conditions.water_temp_f}°F` : "—"}
              />
              <DataItem
                label="Visibility"
                value={conditions.visibility_nm != null ? `${conditions.visibility_nm} nm` : "—"}
              />
            </View>
            <View style={styles.row}>
              <DataItem
                label="Current"
                value={conditions.current_velocity_knots != null ? `${conditions.current_velocity_knots} kts` : "—"}
              />
              <DataItem
                label="Direction"
                value={
                  conditions.current_direction_deg != null
                    ? degreesToCardinal(conditions.current_direction_deg)
                    : "—"
                }
              />
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
  stationLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontStyle: "italic",
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
