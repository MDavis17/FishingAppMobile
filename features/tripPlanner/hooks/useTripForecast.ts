import { useEffect, useMemo, useState } from "react";
import {
  getTripForecast,
  TripForecast,
} from "common/api/getTripForecast";
import { Location } from "types";

const FORECAST_MAX_MS = 7 * 24 * 60 * 60 * 1000;

export type TripForecastStatus =
  | "loading"
  | "ready"
  | "tooFar"
  | "past"
  | "error";

interface TripForecastState {
  forecast: TripForecast | null;
  status: TripForecastStatus;
}

type TripWindow = "past" | "tooFar" | "inRange" | "invalid";

function classifyTripTime(dateIso: string): TripWindow {
  const tripMs = new Date(dateIso).getTime();
  if (Number.isNaN(tripMs)) {
    return "invalid";
  }
  const now = Date.now();
  if (tripMs < now) {
    return "past";
  }
  if (tripMs - now > FORECAST_MAX_MS) {
    return "tooFar";
  }
  return "inRange";
}

export default function useTripForecast(
  location: Location,
  dateIso: string,
): TripForecastState {
  const tripWindow = useMemo(() => classifyTripTime(dateIso), [dateIso]);

  const [forecast, setForecast] = useState<TripForecast | null>(null);
  const [status, setStatus] = useState<TripForecastStatus>(() => {
    if (tripWindow === "past") return "past";
    if (tripWindow === "tooFar") return "tooFar";
    if (tripWindow === "invalid") return "error";
    return "loading";
  });

  useEffect(() => {
    if (tripWindow === "past") {
      setForecast(null);
      setStatus("past");
      return;
    }
    if (tripWindow === "tooFar") {
      setForecast(null);
      setStatus("tooFar");
      return;
    }
    if (tripWindow === "invalid") {
      setForecast(null);
      setStatus("error");
      return;
    }

    let cancelled = false;

    const fetchForecast = async () => {
      setStatus("loading");
      setForecast(null);
      try {
        const response = await getTripForecast(
          location.coordinates.latitude,
          location.coordinates.longitude,
          dateIso,
        );
        if (cancelled) return;
        if (response.ok) {
          setForecast(response.data as TripForecast);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useTripForecast: fetch failed", err);
          setStatus("error");
        }
      }
    };

    fetchForecast();

    return () => {
      cancelled = true;
    };
  }, [
    tripWindow,
    location.coordinates.latitude,
    location.coordinates.longitude,
    dateIso,
  ]);

  return { forecast, status };
}
