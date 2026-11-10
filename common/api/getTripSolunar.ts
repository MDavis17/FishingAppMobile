import { unauthenticatedFetch } from "./request";

export type SolunarPeriodKind = "major" | "minor";

export interface SolunarPeriod {
  kind: SolunarPeriodKind;
  start: string;
  end: string;
}

export interface TripSolunarData {
  sunrise: string | null;
  sunset: string | null;
  periods: SolunarPeriod[];
}

export const getTripSolunar = async (
  lat: number,
  lng: number,
  datetime: string,
) => {
  const encoded = encodeURIComponent(datetime);
  return await unauthenticatedFetch(
    `marine/solunar?latitude=${lat}&longitude=${lng}&datetime=${encoded}`,
  );
};
