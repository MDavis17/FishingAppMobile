import { unauthenticatedFetch } from "./request";

export interface TripForecast {
  air_temp_f: number | null;
  weather_description: string | null;
  water_temp_f: number | null;
  wind_speed_mph: number | null;
  wind_direction_deg: number | null;
  wind_gusts_mph: number | null;
  pressure_inhg: number | null;
  surf_height_ft: number | null;
}

export const getTripForecast = async (
  lat: number,
  lng: number,
  datetime: string,
) => {
  const encoded = encodeURIComponent(datetime);
  return await unauthenticatedFetch(
    `marine/forecast?latitude=${lat}&longitude=${lng}&datetime=${encoded}`,
  );
};
