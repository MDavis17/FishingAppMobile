import { unauthenticatedFetch } from "./request";

export type MarineConditions = {
  water_temp_f: number | null;
  water_temp_source: string | null;
  current_velocity_knots: number | null;
  current_direction_deg: number | null;
  visibility_nm: number | null;
  nearest_station_id: string | null;
  nearest_station_name: string | null;
};

export type WeatherConditions = {
  air_temp_f: number | null;
  wind_speed_mph: number | null;
  wind_direction_deg: number | null;
  wind_gusts_mph: number | null;
  precipitation_in: number | null;
  sunrise: string | null;
  sunset: string | null;
};

export type TidePrediction = {
  time: string;
  height_ft: number;
  type: "H" | "L";
};

export type TideData = {
  station_id: string;
  station_name: string;
  predictions: TidePrediction[];
};

export type MoonPhase = {
  phase_name: string | null;
  illumination_pct: number | null;
  moonrise: string | null;
  moonset: string | null;
};

export type AstronomyData = {
  sunrise: string | null;
  sunset: string | null;
  moon: MoonPhase | null;
};

export type BathymetryData = {
  latitude: number;
  longitude: number;
  depth_m: number | null;
};

export type KelpBed = {
  bed_number: number;
  status: string;
};

export type KelpData = {
  kelp_beds: KelpBed[];
  search_radius_deg: number;
};

const coordParams = (lat: number, lon: number) =>
  `latitude=${lat}&longitude=${lon}`;

export const getMarineConditions = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/conditions?${coordParams(lat, lon)}`);
};

export const getMarineWeather = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/weather?${coordParams(lat, lon)}`);
};

export const getMarineTides = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/tides?${coordParams(lat, lon)}`);
};

export const getMarineAstronomy = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/astronomy?${coordParams(lat, lon)}`);
};

export const getMarineBathymetry = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/bathymetry?${coordParams(lat, lon)}`);
};

export const getMarineKelp = async (lat: number, lon: number) => {
  return unauthenticatedFetch(`marine/kelp?${coordParams(lat, lon)}`);
};
