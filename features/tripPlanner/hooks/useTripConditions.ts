import { useEffect, useState } from "react";
import {
  getTripConditions,
  TripConditions,
} from "common/api/getTripConditions";
import { getTripTides, TripTidesData } from "common/api/getTripTides";
import { Location } from "types";

export type TripConditionsStatus = "loading" | "ready" | "tooFar" | "error";
export type TripTidesStatus = "ready" | "error";

interface TripConditionsState {
  conditions: TripConditions | null;
  status: TripConditionsStatus;
  tides: TripTidesData | null;
  tidesStatus: TripTidesStatus;
}

function isTooFarDetail(detail: unknown): boolean {
  return (
    typeof detail === "string" &&
    detail.toLowerCase().includes("within 7 days")
  );
}

export default function useTripConditions(
  location: Location,
  dateIso: string,
): TripConditionsState {
  const [conditions, setConditions] = useState<TripConditions | null>(null);
  const [status, setStatus] = useState<TripConditionsStatus>("loading");
  const [tides, setTides] = useState<TripTidesData | null>(null);
  const [tidesStatus, setTidesStatus] = useState<TripTidesStatus>("ready");

  useEffect(() => {
    let cancelled = false;

    const fetchConditions = async () => {
      setStatus("loading");
      setConditions(null);
      setTides(null);
      setTidesStatus("ready");

      const lat = location.coordinates.latitude;
      const lng = location.coordinates.longitude;

      try {
        const [conditionsResponse, tidesResponse] = await Promise.all([
          getTripConditions(lat, lng, dateIso),
          getTripTides(lat, lng, dateIso),
        ]);
        if (cancelled) return;

        if (conditionsResponse.ok) {
          setConditions(conditionsResponse.data as TripConditions);
          setStatus("ready");
        } else if (
          conditionsResponse.status === 400 &&
          isTooFarDetail(conditionsResponse.data?.detail)
        ) {
          setStatus("tooFar");
        } else {
          setStatus("error");
        }

        if (tidesResponse.ok) {
          setTides(tidesResponse.data as TripTidesData);
          setTidesStatus("ready");
        } else {
          setTides(null);
          setTidesStatus("error");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useTripConditions: fetch failed", err);
          setStatus("error");
          setTides(null);
          setTidesStatus("error");
        }
      }
    };

    fetchConditions();

    return () => {
      cancelled = true;
    };
  }, [
    location.coordinates.latitude,
    location.coordinates.longitude,
    dateIso,
  ]);

  return { conditions, status, tides, tidesStatus };
}
