import { useState, useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import { getPlaceSuggestions } from "common/api/getPlaceSuggestions";
import { getPlaceDetails } from "common/api/getPlaceDetails";
import { generalLocationFromAddressComponents } from "common/utils/generalLocationFromAddressComponents";
import { LocationSelection } from "types";

export default function useCustomPlacesInput(
  onLocationSelect: (selection: LocationSelection) => void,
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<{ blur: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchPlaces = async () => {
      try {
        const response = await getPlaceSuggestions(encodeURIComponent(query));

        if (!cancelled && response.ok) {
          setResults(response.data.predictions || []);
          setShowResults(true);
        }
      } catch (err) {
        console.error("Error fetching autocomplete suggestions:", err);
      }
    };

    const debounce = setTimeout(fetchPlaces, 300);
    return () => {
      clearTimeout(debounce);
      cancelled = true;
    };
  }, [query]);

  const handleSelect = async (item: { place_id: string; description: string }) => {
    try {
      const response = await getPlaceDetails(item.place_id);
      if (!response.ok) {
        throw response;
      }

      const result = response.data.result;
      const location = result?.geometry?.location;
      if (location) {
        setQuery(item.description);
        setResults([]);
        setShowResults(false);
        inputRef.current?.blur();
        Keyboard.dismiss();

        setTimeout(() => setShowResults(false), 500);

        const generalLocationName = generalLocationFromAddressComponents(
          result.address_components,
        );

        onLocationSelect({
          coordinates: {
            latitude: location.lat,
            longitude: location.lng,
          },
          placeName: result.name,
          generalLocationName,
        });
      } else {
        console.warn("Location not found in place details");
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };
  return {
    inputRef,
    query,
    setQuery,
    showResults,
    results,
    handleSelect,
  };
}