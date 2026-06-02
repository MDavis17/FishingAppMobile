import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DashboardCard from "features/anglerHome/components/DashboardCard";
import { WeatherConditions } from "common/api/getMarineWeather";
import HourlyTemperatureChartStatic from "./HourlyTemperatureChartStatic";

interface Props {
  weather: WeatherConditions | null;
  isLoading: boolean;
  error: string | null;
}

function CardContent({ weather, isLoading, error }: Props) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text
          variant="bodySmall"
          style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}
        >
          Loading temperature...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text
          variant="bodySmall"
          style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.centered}>
        <Text
          variant="bodySmall"
          style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}
        >
          Set a location to see conditions.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        {weather.air_temp_f !== null &&
          weather.air_temp_f_min !== null &&
          weather.air_temp_f_max !== null && (
            <>
              <View style={styles.statBlock}>
                <Text
                  variant="headlineMedium"
                  style={[styles.tempValue, { color: theme.colors.primary }]}
                >
                  {Math.round(weather.air_temp_f)}°F
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}
                >
                  Hi: {Math.round(weather.air_temp_f_max)}°F
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}
                >
                  Lo: {Math.round(weather.air_temp_f_min)}°F
                </Text>
              </View>
            </>
          )}
      </View>

      {weather.hourly.length > 0 && (
        <HourlyTemperatureChartStatic hourly={weather.hourly} />
      )}
    </View>
  );
}

export default function TemperatureCardStatic({
  weather,
  isLoading,
  error,
}: Props) {
  return (
    <DashboardCard
      title="Air Temperature"
      hideActionFooter
      content={
        <CardContent weather={weather} isLoading={isLoading} error={error} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  statsContainer: {
    justifyContent: "center",
    marginBottom: 4,
  },
  centered: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  statusText: {
    textAlign: "center",
  },
  statBlock: {
    alignItems: "center",
  },
  tempValue: {
    fontWeight: "700",
  },
  statColumn: {
    gap: 2,
  },
});
