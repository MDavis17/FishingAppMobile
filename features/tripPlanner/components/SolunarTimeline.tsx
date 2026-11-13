import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";
import { TripSolunarData } from "common/api/getTripSolunar";
import {
  formatChartHourLabel,
  X_LABEL_HOURS,
} from "features/tripPlanner/utils/tideChart";
import {
  dayBoundsFromTripDate,
  fracToX,
  periodsToClippedSegments,
  timestampToDayFraction,
} from "features/tripPlanner/utils/solunarTimeline";

const BAR_HEIGHT_MINOR = 10;
const BAR_HEIGHT_MAJOR = 14;
const TRACK_RADIUS = 7;
const SUN_ICON_SIZE = 18;
const TICK_EXTENSION = 4;
const X_LABEL_WIDTH = 36;

interface Props {
  solunar: TripSolunarData;
  tripDateIso: string;
}

export default function SolunarTimeline({ solunar, tripDateIso }: Props) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setWidth(w);
  };

  const bounds = useMemo(
    () => dayBoundsFromTripDate(tripDateIso),
    [tripDateIso],
  );

  const scales = useMemo(() => {
    if (!bounds || width <= 0) return null;
    const plotWidth = Math.max(1, width - X_LABEL_WIDTH);
    return { ...bounds, plotWidth };
  }, [bounds, width]);

  const segments = useMemo(() => {
    if (!scales) return [];
    return periodsToClippedSegments(
      solunar.periods,
      scales.dayStartMs,
      scales.dayEndMs,
    );
  }, [solunar.periods, scales]);

  const sunriseFrac = useMemo(() => {
    if (!scales || !solunar.sunrise) return null;
    return timestampToDayFraction(
      solunar.sunrise,
      scales.dayStartMs,
      scales.dayEndMs,
    );
  }, [scales, solunar.sunrise]);

  const sunsetFrac = useMemo(() => {
    if (!scales || !solunar.sunset) return null;
    return timestampToDayFraction(
      solunar.sunset,
      scales.dayStartMs,
      scales.dayEndMs,
    );
  }, [scales, solunar.sunset]);

  const primary = theme.colors.primary;
  const onSurface = theme.colors.onSurface;
  const muted = theme.colors.onSurfaceVariant;
  const trackBg = `${primary}26`;

  const barTop = SUN_ICON_SIZE + 4;
  const labelTop = barTop + BAR_HEIGHT_MAJOR + TICK_EXTENSION + 6;
  const plotLeft = X_LABEL_WIDTH / 2;

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      {width > 0 && scales && (
        <>
          <View
            style={[
              styles.track,
              {
                top: barTop,
                left: plotLeft,
                width: scales.plotWidth,
                height: BAR_HEIGHT_MINOR,
                backgroundColor: trackBg,
                borderRadius: TRACK_RADIUS,
              },
            ]}
          />
          {segments
            .filter((s) => s.kind === "minor")
            .map((seg, i) => {
              const left = plotLeft + fracToX(seg.startFrac, scales.plotWidth);
              const segWidth =
                plotLeft + fracToX(seg.endFrac, scales.plotWidth) - left;
              return (
                <View
                  key={`minor-${i}-${seg.startFrac}`}
                  style={[
                    styles.segment,
                    {
                      top: barTop,
                      left,
                      width: Math.max(1, segWidth),
                      height: BAR_HEIGHT_MINOR,
                      backgroundColor: theme.colors.secondary,
                      borderRadius: TRACK_RADIUS,
                    },
                  ]}
                />
              );
            })}
          {segments
            .filter((s) => s.kind === "major")
            .map((seg, i) => {
              const left = plotLeft + fracToX(seg.startFrac, scales.plotWidth);
              const segWidth =
                plotLeft + fracToX(seg.endFrac, scales.plotWidth) - left;
              const majorTop =
                barTop - (BAR_HEIGHT_MAJOR - BAR_HEIGHT_MINOR) / 2;
              return (
                <View
                  key={`major-${i}-${seg.startFrac}`}
                  style={[
                    styles.segment,
                    {
                      top: majorTop,
                      left,
                      width: Math.max(1, segWidth),
                      height: BAR_HEIGHT_MAJOR,
                      backgroundColor: primary,
                      borderRadius: TRACK_RADIUS,
                    },
                  ]}
                />
              );
            })}
          {sunriseFrac !== null && sunriseFrac >= 0 && sunriseFrac <= 1 && (
            <SunMark
              frac={sunriseFrac}
              plotLeft={plotLeft}
              plotWidth={scales.plotWidth}
              barTop={barTop}
              barHeight={BAR_HEIGHT_MAJOR}
              icon="weather-sunset-up"
              primary={primary}
              onSurface={onSurface}
            />
          )}
          {sunsetFrac !== null && sunsetFrac >= 0 && sunsetFrac <= 1 && (
            <SunMark
              frac={sunsetFrac}
              plotLeft={plotLeft}
              plotWidth={scales.plotWidth}
              barTop={barTop}
              barHeight={BAR_HEIGHT_MAJOR}
              icon="weather-sunset-down"
              primary={primary}
              onSurface={onSurface}
            />
          )}
          {X_LABEL_HOURS.map((hour) => {
            const ms =
              scales.dayStartMs +
              (hour / 24) * (scales.dayEndMs - scales.dayStartMs);
            const t =
              (ms - scales.dayStartMs) / (scales.dayEndMs - scales.dayStartMs);
            const x = plotLeft + t * scales.plotWidth;
            return (
              <Text
                key={`xlabel-${hour}`}
                style={[
                  styles.xLabel,
                  {
                    left: x - X_LABEL_WIDTH / 2,
                    top: labelTop,
                    color: muted,
                  },
                ]}
              >
                {formatChartHourLabel(hour)}
              </Text>
            );
          })}
        </>
      )}
    </View>
  );
}

function SunMark({
  frac,
  plotLeft,
  plotWidth,
  barTop,
  barHeight,
  icon,
  primary,
  onSurface,
}: {
  frac: number;
  plotLeft: number;
  plotWidth: number;
  barTop: number;
  barHeight: number;
  icon: "weather-sunset-up" | "weather-sunset-down";
  primary: string;
  onSurface: string;
}) {
  const x = plotLeft + fracToX(frac, plotWidth);
  const tickTop = barTop - TICK_EXTENSION;
  const tickHeight = barHeight + TICK_EXTENSION * 2;
  return (
    <>
      <View
        style={[
          styles.tick,
          {
            left: x - 0.5,
            top: tickTop,
            height: tickHeight,
            backgroundColor: onSurface,
          },
        ]}
      />
      <View style={[styles.sunIcon, { left: x - SUN_ICON_SIZE / 2, top: 0 }]}>
        <MaterialCommunityIcons
          name={icon}
          size={SUN_ICON_SIZE}
          color={primary}
        />
      </View>
    </>
  );
}

const LABEL_BAND = 22;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    minHeight:
      SUN_ICON_SIZE + 4 + BAR_HEIGHT_MAJOR + TICK_EXTENSION + 6 + LABEL_BAND,
    marginTop: 4,
    marginBottom: 4,
  },
  track: {
    position: "absolute",
  },
  segment: {
    position: "absolute",
  },
  tick: {
    position: "absolute",
    width: 1,
    opacity: 0.65,
  },
  sunIcon: {
    position: "absolute",
  },
  xLabel: {
    position: "absolute",
    width: X_LABEL_WIDTH,
    fontSize: 10,
    textAlign: "center",
  },
});
