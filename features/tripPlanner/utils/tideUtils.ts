import { TideExtreme, TideKind } from "common/api/getTripTides";
import { parse } from "date-fns";

export function formatTideTime(noaaTime: string): string {
  try {
    const parsed = parse(noaaTime, "yyyy-MM-dd HH:mm", new Date());
    return parsed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return noaaTime;
  }
}

export function extremeLabel(kind: TideKind, extreme: TideExtreme): string {
  const level = extreme === "major" ? "Major" : "Minor";
  const tide = kind === "high" ? "High" : "Low";
  return `${level} ${tide}`;
}

export function formatSolunarTime(localTimestamp: string): string {
  try {
    const parsed = parse(localTimestamp, "yyyy-MM-dd HH:mm", new Date());
    return parsed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return localTimestamp;
  }
}

export function formatSolunarWindow(start: string, end: string): string {
  return `${formatSolunarTime(start)} – ${formatSolunarTime(end)}`;
}
