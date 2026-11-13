import { parseISO, startOfDay, addDays } from "date-fns";
import { SolunarPeriod } from "common/api/getTripSolunar";
import { parseTideTimeMs } from "features/tripPlanner/utils/tideChart";

export interface DayTimelineScale {
  dayStartMs: number;
  dayEndMs: number;
  plotWidth: number;
}

export interface ClippedSegment {
  kind: SolunarPeriod["kind"];
  startFrac: number;
  endFrac: number;
}

export function dayBoundsFromTripDate(tripDateIso: string): {
  dayStartMs: number;
  dayEndMs: number;
} | null {
  try {
    const tripDay = parseISO(tripDateIso);
    if (Number.isNaN(tripDay.getTime())) return null;
    const dayStart = startOfDay(tripDay);
    const dayStartMs = dayStart.getTime();
    const dayEndMs = addDays(dayStart, 1).getTime();
    return { dayStartMs, dayEndMs };
  } catch {
    return null;
  }
}

export function timestampToDayFraction(
  timestamp: string,
  dayStartMs: number,
  dayEndMs: number,
): number | null {
  const ms = parseTideTimeMs(timestamp);
  if (Number.isNaN(ms)) return null;
  const span = dayEndMs - dayStartMs;
  if (span <= 0) return null;
  return (ms - dayStartMs) / span;
}

export function clipPeriodToDay(
  period: SolunarPeriod,
  dayStartMs: number,
  dayEndMs: number,
): ClippedSegment | null {
  const startFrac = timestampToDayFraction(period.start, dayStartMs, dayEndMs);
  const endFrac = timestampToDayFraction(period.end, dayStartMs, dayEndMs);
  if (startFrac === null || endFrac === null) return null;

  const clippedStart = Math.max(0, Math.min(1, startFrac));
  const clippedEnd = Math.max(0, Math.min(1, endFrac));
  if (clippedEnd <= clippedStart) return null;

  return { kind: period.kind, startFrac: clippedStart, endFrac: clippedEnd };
}

export function periodsToClippedSegments(
  periods: SolunarPeriod[],
  dayStartMs: number,
  dayEndMs: number,
): ClippedSegment[] {
  return periods
    .map((p) => clipPeriodToDay(p, dayStartMs, dayEndMs))
    .filter((s): s is ClippedSegment => s !== null);
}

export function fracToX(frac: number, plotWidth: number): number {
  return Math.max(0, Math.min(plotWidth, frac * plotWidth));
}
