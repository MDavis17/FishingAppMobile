import { useState, useCallback, useEffect } from "react";
import { RangeData } from "types";
import { getSpeciesRange } from "../api/getSpeciesRange";

export default function useSpeciesRange(speciesId: number) {
  const [rangeData, setRangeData] = useState<RangeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRangeData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getSpeciesRange(speciesId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setRangeData(response.data);
    } catch (error) {
      console.error("Error fetching species range:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRangeData();
  }, []);

  return {
    isLoading,
    rangeData,
    fetchRangeData,
  };
}
