import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type WeatherIconName = NonNullable<
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

export const getWeatherIconName = (
  weatherCondition: string,
): WeatherIconName => {
  const condition = weatherCondition.toLowerCase();

  if (condition.includes("hail")) {
    return "weather-hail";
  }
  if (condition.includes("thunder")) {
    return "weather-lightning";
  }
  if (condition.includes("snow")) {
    return condition.includes("heavy")
      ? "weather-snowy-heavy"
      : "weather-snowy";
  }
  if (condition.includes("freezing")) {
    return "weather-snowy-rainy";
  }
  if (condition.includes("drizzle")) {
    return "weather-rainy";
  }
  if (condition.includes("rain") || condition.includes("shower")) {
    if (condition.includes("heavy") || condition.includes("violent")) {
      return "weather-pouring";
    }
    if (condition.includes("slight") || condition.includes("light")) {
      return "weather-partly-rainy";
    }
    return "weather-rainy";
  }
  if (condition.includes("fog")) {
    return "weather-fog";
  }
  if (condition.includes("overcast")) {
    return "weather-cloudy";
  }
  if (condition.includes("cloud") || condition.includes("partly")) {
    return "weather-partly-cloudy";
  }
  if (condition.includes("clear") || condition.includes("sunny")) {
    return "weather-sunny";
  }
  return "weather-partly-cloudy";
};

const COMPASS_8 = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

export function windDirectionToCompass(degrees: number | null): string | null {
  if (degrees === null || Number.isNaN(degrees)) {
    return null;
  }
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return COMPASS_8[index];
}

export function formatWind(
  speedMph: number | null,
  directionDeg: number | null,
): string {
  if (speedMph === null) {
    return "—";
  }
  const compass = windDirectionToCompass(directionDeg);
  return compass
    ? `${Math.round(speedMph)} mph ${compass}`
    : `${Math.round(speedMph)} mph`;
}
