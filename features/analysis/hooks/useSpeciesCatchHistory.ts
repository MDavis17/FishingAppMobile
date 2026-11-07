import { getSpeciesCatchHistory } from "features/analysis/api/getSpeciesCatchHistory";
import { useCallback, useEffect, useState } from "react";
import { SpeciesCatchHistory } from "types";

export default function useSpeciesCatchHistory(speciesId: number) {
  const [history, setHistory] = useState<SpeciesCatchHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSpeciesCatchHistory(speciesId);

      if (!response.ok) {
        const detail =
          typeof response.data === "object" &&
          response.data !== null &&
          "detail" in response.data
            ? String((response.data as { detail: unknown }).detail)
            : null;

        throw new Error(detail ?? "Something went wrong");
      }

      setHistory(response.data as SpeciesCatchHistory);
    } catch (fetchError) {
      console.error("Error fetching species catch history:", fetchError);
      setError("Could not load catch history.");
      setHistory(null);
    } finally {
      setIsLoading(false);
    }
  }, [speciesId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error };
}
