import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import { HourlyDataPoint } from "common/api/getMarineWeather";

interface Props {
  hourly: HourlyDataPoint[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH / 1.55;
const CHART_HEIGHT = 80;
const INITIAL_SPACING = 8;
const END_SPACING = 8;

const LABEL_HOURS = new Set([0, 6, 12, 18]);

function formatHourLabel(timeStr: string): string {
  const hourStr = timeStr.split("T")[1];
  if (!hourStr) return "";
  const hour = parseInt(hourStr.split(":")[0], 10);
  if (hour === 0) return "12AM";
  if (hour === 12) return "12PM";
  return hour < 12 ? `${hour}AM` : `${hour - 12}PM`;
}

function getCurrentHourIndex(hourly: HourlyDataPoint[]): number {
  const now = new Date();
  const nowStr =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}T` +
    `${String(now.getHours()).padStart(2, "0")}:00`;
  const idx = hourly.findIndex((p) => p.time === nowStr);
  return idx >= 0 ? idx : -1;
}

export default function HourlyTemperatureChartStatic({ hourly }: Props) {
  const theme = useTheme();

  const currentIdx = useMemo(() => getCurrentHourIndex(hourly), [hourly]);

  const spacing = useMemo(() => {
    if (hourly.length <= 1) return CHART_WIDTH;
    return Math.floor(
      (CHART_WIDTH - INITIAL_SPACING - END_SPACING) / (hourly.length - 1),
    );
  }, [hourly.length]);

  const chartData = useMemo(() => {
    return hourly.map((point, i) => {
      const hour = parseInt(
        (point.time.split("T")[1] ?? "00").split(":")[0],
        10,
      );
      const shouldShowLabel = LABEL_HOURS.has(hour);
      return {
        value: point.temperature_f ?? 0,
        label: shouldShowLabel ? formatHourLabel(point.time) : undefined,
        showStrip: i === currentIdx,
        stripColor: theme.colors.primary,
        stripWidth: 1,
        stripHeight: CHART_HEIGHT,
        stripOpacity: 0.6,
        labelTextStyle: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 10,
          width: shouldShowLabel ? 50 : 0,
          textAlign: "left" as const,
        },
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
        spacing={spacing}
        initialSpacing={INITIAL_SPACING}
        endSpacing={END_SPACING}
        curved
        color={theme.colors.primary}
        thickness={1}
        noOfSections={4}
        yAxisColor="transparent"
        yAxisOffset={minTemp}
        xAxisColor={theme.colors.surfaceVariant}
        rulesColor={theme.colors.surfaceVariant}
        yAxisLabelSuffix="°"
        formatYLabel={(label) => String(Math.round(Number(label)))}
        yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
        xAxisLabelTextStyle={{
          color: theme.colors.onSurfaceVariant,
          fontSize: 10,
        }}
        hideDataPoints={true}
        disableScroll
        isAnimated
        animationDuration={600}
        startFillColor={theme.colors.primary}
        endFillColor={theme.colors.primary}
        startOpacity={0.3}
        endOpacity={0.01}
        areaChart
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
