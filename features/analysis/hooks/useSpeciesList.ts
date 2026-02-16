import { useState, useCallback, useEffect } from "react";
import { Species } from "types";
import { getSpecies } from "../api/getSpecies";
import { toggleSpeciesFavorite } from "../api/toggleSpeciesFavorite";

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
  }, []);

  const toggleFavorite = useCallback(async (speciesId: number) => {
    try {
      const response = await toggleSpeciesFavorite(speciesId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setSpeciesList((prev) =>
        prev.map((species) =>
          species.id === speciesId
            ? { ...species, isFavorite: !species.isFavorite }
            : species,
        ),
      );
    } catch (error) {
      console.error("Error toggling species favorite:", error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    speciesList,
    setSpeciesList,
    fetchSpecies,
    toggleFavorite,
  };
}
