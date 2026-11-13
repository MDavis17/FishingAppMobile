import { parse } from "date-fns";
import { TideEvent, TideHeightPoint } from "common/api/getTripTides";

export const CHART_PADDING = {
  top: 12,
  right: 8,
  bottom: 24,
  left: 36,
};

const TIME_FMT = "yyyy-MM-dd HH:mm";

export interface ChartPoint {
  x: number;
  y: number;
  timeMs: number;
  heightFt: number;
}

export interface TideChartScales {
  dayStartMs: number;
  dayEndMs: number;
  yMin: number;
  yMax: number;
  yTicks: number[];
  plotWidth: number;
  plotHeight: number;
}

export function parseTideTimeMs(noaaTime: string): number {
  try {
    return parse(noaaTime, TIME_FMT, new Date()).getTime();
  } catch {
    return NaN;
  }
}

export function dayBoundsFromHeights(heights: TideHeightPoint[]): {
  dayStartMs: number;
  dayEndMs: number;
} | null {
  if (heights.length === 0) return null;
  const first = parseTideTimeMs(heights[0].time);
  if (Number.isNaN(first)) return null;
  const d = new Date(first);
  d.setHours(0, 0, 0, 0);
  const dayStartMs = d.getTime();
  const dayEndMs = dayStartMs + 24 * 60 * 60 * 1000;
  return { dayStartMs, dayEndMs };
}

export function computeYDomain(
  heights: TideHeightPoint[],
  events: TideEvent[],
): { yMin: number; yMax: number; yTicks: number[] } {
  const values = [
    ...heights.map((h) => h.height_ft),
    ...events.map((e) => e.height_ft),
  ];
  if (values.length === 0) {
    return { yMin: -2, yMax: 8, yTicks: [-2, 0, 2, 4, 6, 8] };
  }
  let rawMin = Math.min(...values);
  let rawMax = Math.max(...values);
  const pad = 0.75;
  rawMin -= pad;
  rawMax += pad;

  const yMin = Math.floor(rawMin / 2) * 2;
  const yMax = Math.ceil(rawMax / 2) * 2;
  const yTicks: number[] = [];
  for (let t = yMax; t >= yMin; t -= 2) {
    yTicks.push(t);
  }
  return { yMin, yMax, yTicks };
}

export function buildScales(
  width: number,
  height: number,
  heights: TideHeightPoint[],
  events: TideEvent[],
): TideChartScales | null {
  const bounds = dayBoundsFromHeights(heights);
  if (!bounds) return null;
  const { yMin, yMax, yTicks } = computeYDomain(heights, events);
  const plotWidth = Math.max(1, width - CHART_PADDING.left - CHART_PADDING.right);
  const plotHeight = Math.max(
    1,
    height - CHART_PADDING.top - CHART_PADDING.bottom,
  );
  return {
    ...bounds,
    yMin,
    yMax,
    yTicks,
    plotWidth,
    plotHeight,
  };
}

export function timeToX(timeMs: number, scales: TideChartScales): number {
  const { dayStartMs, dayEndMs, plotWidth } = scales;
  const t = (timeMs - dayStartMs) / (dayEndMs - dayStartMs);
  return CHART_PADDING.left + t * plotWidth;
}

export function heightToY(heightFt: number, scales: TideChartScales): number {
  const { yMin, yMax, plotHeight } = scales;
  const range = yMax - yMin || 1;
  const t = (heightFt - yMin) / range;
  return CHART_PADDING.top + plotHeight * (1 - t);
}

export function heightsToChartPoints(
  heights: TideHeightPoint[],
  scales: TideChartScales,
): ChartPoint[] {
  return heights
    .map((h) => {
      const timeMs = parseTideTimeMs(h.time);
      if (Number.isNaN(timeMs)) return null;
      return {
        x: timeToX(timeMs, scales),
        y: heightToY(h.height_ft, scales),
        timeMs,
        heightFt: h.height_ft,
      };
    })
    .filter((p): p is ChartPoint => p !== null)
    .sort((a, b) => a.timeMs - b.timeMs);
}

export function eventToChartPoint(
  event: TideEvent,
  scales: TideChartScales,
): ChartPoint | null {
  const timeMs = parseTideTimeMs(event.time);
  if (Number.isNaN(timeMs)) return null;
  return {
    x: timeToX(timeMs, scales),
    y: heightToY(event.height_ft, scales),
    timeMs,
    heightFt: event.height_ft,
  };
}

/** Catmull-Rom to cubic Bézier SVG path for a smooth line through points. */
export function catmullRomPath(points: ChartPoint[], closeAreaBottom?: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  if (closeAreaBottom !== undefined && points.length > 1) {
    const last = points[points.length - 1];
    const first = points[0];
    d += ` L ${last.x} ${closeAreaBottom} L ${first.x} ${closeAreaBottom} Z`;
  }

  return d;
}

export function formatChartHourLabel(hour: number): string {
  if (hour === 0 || hour === 24) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export const X_LABEL_HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
