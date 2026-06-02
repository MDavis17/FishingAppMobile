import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { HourlyDataPoint } from "common/api/getMarineWeather";

interface Props {
  hourly: HourlyDataPoint[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 100; // account for card padding and y-axis
const CHART_HEIGHT = 140;

function formatHourLabel(timeStr: string): string {
  // timeStr format: "2026-06-01T14:00"
  const hourStr = timeStr.split("T")[1];
  if (!hourStr) return "";
  const hour = parseInt(hourStr.split(":")[0], 10);
  if (hour === 0) return "12AM";
  if (hour === 12) return "12PM";
  return hour < 12 ? `${hour}AM` : `${hour - 12}PM`;
}

function getCurrentHourIndex(hourly: HourlyDataPoint[]): number {
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:00`;
  const idx = hourly.findIndex((p) => p.time === nowStr);
  return idx >= 0 ? idx : -1;
}

// Show labels only at 6-hour intervals to avoid crowding
const LABEL_HOURS = new Set([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);

export default function HourlyTemperatureChart({ hourly }: Props) {
  const theme = useTheme();

  const currentIdx = useMemo(() => getCurrentHourIndex(hourly), [hourly]);

  const chartData = useMemo(() => {
    return hourly.map((point, i) => {
      const hour = parseInt(
        (point.time.split("T")[1] ?? "00").split(":")[0],
        10,
      );
      const showLabel = LABEL_HOURS.has(hour);
      return {
        value: point.temperature_f ?? 0,
        label: showLabel ? formatHourLabel(point.time) : "",
        dataPointColor:
          i === currentIdx ? theme.colors.secondary : theme.colors.primary,
        dataPointRadius: i === currentIdx ? 6 : 3,
        showStrip: i === currentIdx,
        stripColor: theme.colors.primary,
        stripWidth: 2,
        stripHeight: CHART_HEIGHT,
        stripOpacity: 0.8,
      };
    });
  }, [hourly, currentIdx, theme]);

  if (chartData.length === 0) {
    return null;
  }

  const temps = hourly
    .map((p) => p.temperature_f)
    .filter((v): v is number => v !== null);
  const minTemp = Math.floor(Math.min(...temps)) - 2;

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        curved
        color={theme.colors.primary}
        thickness={2}
        noOfSections={4}
        yAxisColor="transparent"
        yAxisOffset={minTemp}
        xAxisColor={theme.colors.surfaceVariant}
        rulesColor={theme.colors.surfaceVariant}
        yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
        xAxisLabelTextStyle={{
          color: theme.colors.onSurfaceVariant,
          fontSize: 10,
        }}
        hideDataPoints={false}
        isAnimated
        animationDuration={600}
        startFillColor={theme.colors.primary}
        endFillColor={theme.colors.primary}
        startOpacity={0.3}
        endOpacity={0.01}
        areaChart
        initialSpacing={12}
        endSpacing={4}
        scrollToIndex={currentIdx - 2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
  },
  nowLabel: {
    marginTop: 4,
    textAlign: "right",
    fontWeight: "600",
  },
});
