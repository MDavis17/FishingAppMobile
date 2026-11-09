import { unauthenticatedFetch } from "./request";

export type TripConditionsSource = "forecast" | "observed";

export interface TripConditions {
  air_temp_f: number | null;
  weather_description: string | null;
  water_temp_f: number | null;
  wind_speed_mph: number | null;
  wind_direction_deg: number | null;
  wind_gusts_mph: number | null;
  pressure_inhg: number | null;
  surf_height_ft: number | null;
  source: TripConditionsSource;
}

export const getTripConditions = async (
  lat: number,
  lng: number,
  datetime: string,
) => {
  const encoded = encodeURIComponent(datetime);
  return await unauthenticatedFetch(
    `marine/trip-conditions?latitude=${lat}&longitude=${lng}&datetime=${encoded}`,
  );
};
