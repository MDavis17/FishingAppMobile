import { unauthenticatedFetch } from "./request";

export interface HourlyDataPoint {
  time: string;
  temperature_f: number | null;
  wind_speed_mph: number | null;
  wind_gusts_mph: number | null;
  wind_direction_deg: number | null;
  precipitation_in: number | null;
}

export interface WeatherConditions {
  air_temp_f: number | null;
  air_temp_f_min: number | null;
  air_temp_f_max: number | null;
  wind_speed_mph: number | null;
  wind_direction_deg: number | null;
  wind_gusts_mph: number | null;
  precipitation_in: number | null;
  sunrise: string | null;
  sunset: string | null;
  hourly: HourlyDataPoint[];
}

export const getMarineWeather = async (lat: number, lng: number) => {
  return await unauthenticatedFetch(
    `marine/weather?latitude=${lat}&longitude=${lng}`,
  );
};
