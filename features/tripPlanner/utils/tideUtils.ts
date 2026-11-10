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
