import { useState, useEffect } from "react";
import { getMarineWeather, WeatherConditions } from "common/api/getMarineWeather";
import { Location } from "types";

interface ConditionsWeather {
  weather: WeatherConditions | null;
  isLoading: boolean;
  error: string | null;
}

export default function useConditionsWeather(
  location: Location | null
): ConditionsWeather {
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setWeather(null);
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMarineWeather(
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        if (cancelled) return;
        if (response.ok) {
          setWeather(response.data as WeatherConditions);
        } else {
          setError("Failed to load weather data.");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useConditionsWeather: fetch failed", err);
          setError("Failed to load weather data.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location?.coordinates.latitude, location?.coordinates.longitude]);

  return { weather, isLoading, error };
}
