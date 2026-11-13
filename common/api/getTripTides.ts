import { unauthenticatedFetch } from "./request";

export type TripTidesSource = "forecast" | "observed";

export type TideKind = "high" | "low";
export type TideExtreme = "major" | "minor";

export interface TideEvent {
  time: string;
  height_ft: number;
  kind: TideKind;
  extreme: TideExtreme;
}

export interface TideHeightPoint {
  time: string;
  height_ft: number;
}

export interface TripTidesData {
  station_id: string;
  station_name: string;
  station_distance_mi: number;
  source: TripTidesSource;
  events: TideEvent[];
  heights?: TideHeightPoint[];
}

export const getTripTides = async (
  lat: number,
  lng: number,
  datetime: string,
) => {
  const encoded = encodeURIComponent(datetime);
  return await unauthenticatedFetch(
    `marine/tides?latitude=${lat}&longitude=${lng}&datetime=${encoded}`,
  );
};
