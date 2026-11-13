import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { TideEvent, TideHeightPoint } from "common/api/getTripTides";
import {
  X_LABEL_HOURS,
  buildScales,
  catmullRomPath,
  eventToChartPoint,
  formatChartHourLabel,
  heightToY,
  heightsToChartPoints,
  timeToX,
  CHART_PADDING,
} from "features/tripPlanner/utils/tideChart";

const DEFAULT_HEIGHT = 160;
const HIT_SIZE = 28;

interface Props {
  heights: TideHeightPoint[];
  events: TideEvent[];
  selectedKey: string | null;
  onSelectEvent: (key: string) => void;
}

export function tideEventKey(event: TideEvent): string {
  return `${event.time}-${event.kind}`;
}

export default function TideChart({
  heights,
  events,
  selectedKey,
  onSelectEvent,
}: Props) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setWidth(w);
  };

  const scales = useMemo(() => {
    if (width <= 0) return null;
    return buildScales(width, DEFAULT_HEIGHT, heights, events);
  }, [width, heights, events]);

  const linePoints = useMemo(() => {
    if (!scales) return [];
    return heightsToChartPoints(heights, scales);
  }, [heights, scales]);

  const areaBottom =
    scales !== null
      ? CHART_PADDING.top + scales.plotHeight
      : DEFAULT_HEIGHT - CHART_PADDING.bottom;

  const linePath = useMemo(() => catmullRomPath(linePoints), [linePoints]);
  const areaPath = useMemo(
    () => catmullRomPath(linePoints, areaBottom),
    [linePoints, areaBottom],
  );

  const eventPoints = useMemo(() => {
    if (!scales) return [];
    return events
      .map((event) => {
        const pt = eventToChartPoint(event, scales);
        if (!pt) return null;
        return {
          event,
          key: tideEventKey(event),
          x: pt.x,
          y: pt.y,
        };
      })
      .filter(
        (p): p is { event: TideEvent; key: string; x: number; y: number } =>
          p !== null,
      );
  }, [events, scales]);

  if (heights.length === 0) {
    return null;
  }

  const primary = theme.colors.primary;
  const gridColor = theme.colors.surfaceVariant;
  const muted = theme.colors.onSurfaceVariant;

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      {width > 0 && scales && (
        <>
          <Svg width={width} height={DEFAULT_HEIGHT}>
            <Defs>
              <LinearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={primary} stopOpacity={0.35} />
                <Stop offset="100%" stopColor={primary} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {scales.yTicks.map((tick) => {
              const y = heightToY(tick, scales);
              return (
                <Line
                  key={`grid-${tick}`}
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={width - CHART_PADDING.right}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth={1}
                />
              );
            })}

            {areaPath ? <Path d={areaPath} fill="url(#tideFill)" /> : null}
            {linePath ? (
              <Path d={linePath} fill="none" stroke={primary} strokeWidth={2} />
            ) : null}

            {eventPoints.map(({ key, x, y }) => {
              const selected = key === selectedKey;
              return (
                <Circle
                  key={key}
                  cx={x}
                  cy={y}
                  r={selected ? 6 : 5}
                  fill={selected ? primary : "#ffffff"}
                  stroke={primary}
                  strokeWidth={selected ? 2.5 : 2}
                />
              );
            })}
          </Svg>

          {scales.yTicks.map((tick) => {
            const y = heightToY(tick, scales);
            return (
              <Text
                key={`ylabel-${tick}`}
                style={[styles.yLabel, { top: y - 8, color: muted }]}
              >
                {tick} ft
              </Text>
            );
          })}

          {X_LABEL_HOURS.map((hour) => {
            const ms =
              scales.dayStartMs +
              (hour / 24) * (scales.dayEndMs - scales.dayStartMs);
            const x = timeToX(ms, scales);
            return (
              <Text
                key={`xlabel-${hour}`}
                style={[
                  styles.xLabel,
                  {
                    left: x - 18,
                    top: DEFAULT_HEIGHT - CHART_PADDING.bottom + 6,
                    color: muted,
                  },
                ]}
              >
                {formatChartHourLabel(hour)}
              </Text>
            );
          })}

          {eventPoints.map(({ key, x, y }) => (
            <Pressable
              key={`hit-${key}`}
              accessibilityRole="button"
              accessibilityLabel="Select tide event"
              hitSlop={4}
              onPress={() => onSelectEvent(key)}
              style={[
                styles.hitTarget,
                {
                  left: x - HIT_SIZE / 2,
                  top: y - HIT_SIZE / 2,
                  width: HIT_SIZE,
                  height: HIT_SIZE,
                },
              ]}
            />
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    minHeight: DEFAULT_HEIGHT,
  },
  yLabel: {
    position: "absolute",
    left: 0,
    width: CHART_PADDING.left - 4,
    fontSize: 10,
    textAlign: "right",
  },
  xLabel: {
    position: "absolute",
    width: 36,
    fontSize: 10,
    textAlign: "center",
  },
  hitTarget: {
    position: "absolute",
  },
});
