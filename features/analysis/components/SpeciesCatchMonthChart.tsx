import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import { MonthlyCatchCount } from "types";

const CHART_HEIGHT = 100;
const Y_AXIS_LABEL_WIDTH = 36;
const INITIAL_SPACING = 4;
const END_SPACING = 4;
const MONTH_COUNT = 12;

interface Props {
  monthlyCounts: MonthlyCatchCount[];
  personalBestMonth?: number | null;
}

function yAxisConfig(peak: number): {
  maxValue: number;
  stepValue: number;
  noOfSections: number;
} {
  if (peak <= 0) {
    return { maxValue: 1, stepValue: 1, noOfSections: 1 };
  }
  if (peak <= 4) {
    return { maxValue: peak, stepValue: 1, noOfSections: peak };
  }
  const noOfSections = 4;
  const stepValue = Math.max(1, Math.ceil(peak / noOfSections));
  return {
    maxValue: stepValue * noOfSections,
    stepValue,
    noOfSections,
  };
}

export default function SpeciesCatchMonthChart({
  monthlyCounts,
  personalBestMonth = null,
}: Props) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setWidth(w);
    }
  };

  const peak = useMemo(
    () => Math.max(0, ...monthlyCounts.map((m) => m.count)),
    [monthlyCounts],
  );

  const layout = useMemo(() => {
    const plotWidth = Math.max(0, width - Y_AXIS_LABEL_WIDTH);
    const inner = plotWidth - INITIAL_SPACING - END_SPACING;
    let barWidth = 10;
    let spacing =
      MONTH_COUNT > 1
        ? (inner - barWidth * MONTH_COUNT) / (MONTH_COUNT - 1)
        : 0;
    if (spacing < 1 && inner > 0) {
      barWidth = Math.max(
        4,
        Math.floor((inner - (MONTH_COUNT - 1)) / MONTH_COUNT),
      );
      spacing =
        MONTH_COUNT > 1
          ? Math.max(0, (inner - barWidth * MONTH_COUNT) / (MONTH_COUNT - 1))
          : 0;
    }
    return { barWidth, spacing };
  }, [width]);

  const yAxis = useMemo(() => yAxisConfig(peak), [peak]);

  const chartData = useMemo(
    () =>
      monthlyCounts.map((m) => ({
        value: m.count,
        label: m.label,
        frontColor: theme.colors.primary,
        labelComponent: () => (
          <View style={styles.monthLabel}>
            <Text
              style={[
                styles.monthText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {m.label}
            </Text>
            {personalBestMonth != null && m.month === personalBestMonth ? (
              <MaterialCommunityIcons
                name="trophy"
                size={14}
                color={theme.colors.primary}
              />
            ) : null}
          </View>
        ),
      })),
    [
      monthlyCounts,
      personalBestMonth,
      theme.colors.onSurfaceVariant,
      theme.colors.primary,
    ],
  );

  if (monthlyCounts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {width > 0 ? (
        <BarChart
          data={chartData}
          width={width}
          height={CHART_HEIGHT}
          barWidth={layout.barWidth}
          spacing={layout.spacing}
          initialSpacing={INITIAL_SPACING}
          endSpacing={END_SPACING}
          maxValue={yAxis.maxValue}
          stepValue={yAxis.stepValue}
          noOfSections={yAxis.noOfSections}
          yAxisOffset={0}
          yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
          yAxisColor="transparent"
          xAxisColor={theme.colors.surfaceVariant}
          rulesColor={theme.colors.surfaceVariant}
          formatYLabel={(label) => String(Math.round(Number(label)))}
          yAxisTextStyle={{
            color: theme.colors.onSurfaceVariant,
            fontSize: 10,
          }}
          xAxisTextNumberOfLines={2}
          disableScroll
          isAnimated
          animationDuration={500}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    marginRight: 12,
    paddingTop: 8,
  },
  monthLabel: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 9,
    textAlign: "center",
  },
});
