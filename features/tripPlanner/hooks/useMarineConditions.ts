import { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  AstronomyData,
  BathymetryData,
  KelpData,
  MarineConditions,
  TideData,
  WeatherConditions,
  getMarineAstronomy,
  getMarineBathymetry,
  getMarineConditions,
  getMarineKelp,
  getMarineTides,
  getMarineWeather,
} from "common/api/marineApi";

// Default to Monterey Bay if location permission is denied
const DEFAULT_LAT = 36.605;
const DEFAULT_LON = -121.888;

export type MarineDataState = {
  conditions: MarineConditions | null;
  weather: WeatherConditions | null;
  tides: TideData | null;
  astronomy: AstronomyData | null;
  bathymetry: BathymetryData | null;
  kelp: KelpData | null;
  isLoading: boolean;
  error: string | null;
  locationName: string | null;
  latitude: number;
  longitude: number;
};

export default function useMarineConditions() {
  const [state, setState] = useState<MarineDataState>({
    conditions: null,
    weather: null,
    tides: null,
    astronomy: null,
    bathymetry: null,
    kelp: null,
    isLoading: true,
    error: null,
    locationName: null,
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LON,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;
    let locationName: string | null = null;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;

        const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (geocode.length > 0) {
          const place = geocode[0];
          locationName = [place.city, place.region].filter(Boolean).join(", ");
        }
      }
    } catch {
      // Use defaults silently
    }

    try {
      const [conditions, weather, tides, astronomy, bathymetry, kelp] = await Promise.allSettled([
        getMarineConditions(lat, lon),
        getMarineWeather(lat, lon),
        getMarineTides(lat, lon),
        getMarineAstronomy(lat, lon),
        getMarineBathymetry(lat, lon),
        getMarineKelp(lat, lon),
      ]);

      setState({
        conditions: conditions.status === "fulfilled" && conditions.value.ok ? conditions.value.data : null,
        weather: weather.status === "fulfilled" && weather.value.ok ? weather.value.data : null,
        tides: tides.status === "fulfilled" && tides.value.ok ? tides.value.data : null,
        astronomy: astronomy.status === "fulfilled" && astronomy.value.ok ? astronomy.value.data : null,
        bathymetry: bathymetry.status === "fulfilled" && bathymetry.value.ok ? bathymetry.value.data : null,
        kelp: kelp.status === "fulfilled" && kelp.value.ok ? kelp.value.data : null,
        isLoading: false,
        error: null,
        locationName,
        latitude: lat,
        longitude: lon,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load marine data",
      }));
    }
  };

  return { ...state, refresh: fetchAll };
}
