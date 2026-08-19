import { unauthenticatedFetch } from "./request";

export interface HourlyWaterTempPoint {
  time: string;
  temperature_f: number | null;
}

export interface MarineConditions {
  water_temp_f: number | null;
  water_temp_source: string | null;
  current_velocity_knots: number | null;
  current_direction_deg: number | null;
  visibility_nm: number | null;
  nearest_station_id: string | null;
  nearest_station_name: string | null;
  hourly: HourlyWaterTempPoint[];
}

export const getMarineConditions = async (lat: number, lng: number) => {
  return await unauthenticatedFetch(
    `marine/conditions?latitude=${lat}&longitude=${lng}`,
  );
};
