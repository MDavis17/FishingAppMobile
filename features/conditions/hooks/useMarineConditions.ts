import { useState, useEffect } from "react";
import { getMarineConditions, MarineConditions } from "common/api/getMarineConditions";
import { Location } from "types";

interface ConditionsResult {
  conditions: MarineConditions | null;
  isLoading: boolean;
  error: string | null;
}

export default function useMarineConditions(
  location: Location | null
): ConditionsResult {
  const [conditions, setConditions] = useState<MarineConditions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setConditions(null);
      return;
    }

    let cancelled = false;

    const fetchConditions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMarineConditions(
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        if (cancelled) return;
        if (response.ok) {
          setConditions(response.data as MarineConditions);
        } else {
          setError("Failed to load water conditions.");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("useMarineConditions: fetch failed", err);
          setError("Failed to load water conditions.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchConditions();

    return () => {
      cancelled = true;
    };
  }, [location?.coordinates.latitude, location?.coordinates.longitude]);

  return { conditions, isLoading, error };
}
