import { useEffect, useState } from "react";
import {
  getTripConditions,
  TripConditions,
} from "common/api/getTripConditions";
import { Location } from "types";

export type TripConditionsStatus = "loading" | "ready" | "tooFar" | "error";

interface TripConditionsState {
  conditions: TripConditions | null;
  status: TripConditionsStatus;
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

  useEffect(() => {
    let cancelled = false;

    const fetchConditions = async () => {
      setStatus("loading");
      setConditions(null);
      try {
        const response = await getTripConditions(
          location.coordinates.latitude,
          location.coordinates.longitude,
          dateIso,
        );
        if (cancelled) return;
        if (response.ok) {
          setConditions(response.data as TripConditions);
          setStatus("ready");
          return;
        }
        if (response.status === 400 && isTooFarDetail(response.data?.detail)) {
          setStatus("tooFar");
          return;
        }
        setStatus("error");
      } catch (err) {
        if (!cancelled) {
          console.error("useTripConditions: fetch failed", err);
          setStatus("error");
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

  return { conditions, status };
}
