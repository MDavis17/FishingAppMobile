import { useState, useEffect, useRef } from "react";
import { getMarineWeather } from "common/api/getMarineWeather";
import { Location } from "types";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 60 minutes

interface HeaderWeather {
  temperature: number | null;
  isLoading: boolean;
}

export default function useHeaderWeather(
  location: Location | null,
): HeaderWeather {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = async (loc: Location) => {
    setIsLoading(true);
    try {
      const response = await getMarineWeather(
        loc.coordinates.latitude,
        loc.coordinates.longitude,
      );
      if (response.ok) {
        setTemperature(response.data?.air_temp_f ?? null);
      }
    } catch (err) {
      console.error("useHeaderWeather: failed to fetch weather", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!location) {
      setTemperature(null);
      return;
    }

    fetchWeather(location);

    intervalRef.current = setInterval(() => {
      fetchWeather(location);
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location?.coordinates.latitude, location?.coordinates.longitude]);

  return { temperature, isLoading };
}
