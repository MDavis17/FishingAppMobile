import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DashboardCard from "features/anglerHome/components/DashboardCard";
import { MarineConditions } from "common/api/getMarineConditions";
import HourlyTemperatureChartStatic from "./HourlyTemperatureChartStatic";

interface Props {
  conditions: MarineConditions | null;
  isLoading: boolean;
  error: string | null;
}

function CardContent({ conditions, isLoading, error }: Props) {
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

  if (!conditions) {
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

  console.log("conditions.hourly", conditions.hourly);

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        {conditions.water_temp_f !== null ? (
          <>
            <View style={styles.statBlock}>
              <Text
                variant="headlineMedium"
                style={[styles.tempValue, { color: theme.colors.primary }]}
              >
                {Math.round(conditions.water_temp_f)}°F
              </Text>
            </View>
            {/* {conditions.water_temp_source !== null && (
              <View style={styles.statBlock}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {conditions.water_temp_source}
                </Text>
              </View>
            )} */}
          </>
        ) : (
          <Text
            variant="bodySmall"
            style={[
              styles.statusText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Water temperature unavailable.
          </Text>
        )}
      </View>

      {conditions.hourly.length > 0 && (
        <HourlyTemperatureChartStatic hourly={conditions.hourly} />
      )}
    </View>
  );
}

export default function WaterTemperatureCard({
  conditions,
  isLoading,
  error,
}: Props) {
  return (
    <DashboardCard
      title="Water Temperature"
      hideActionFooter
      content={
        <CardContent
          conditions={conditions}
          isLoading={isLoading}
          error={error}
        />
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
});
