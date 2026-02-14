import { useState, useCallback, useEffect } from "react";
import { Species } from "types";
import { getSpecies } from "../api/getSpecies";

export default function useSpeciesList() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSpecies = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getSpecies();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setSpeciesList(response.data);
    } catch (error) {
      console.error("Error fetching species:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecies();
  },[]);

  return {
    isLoading,
    speciesList,
    setSpeciesList,
    fetchSpecies,
  };
}
