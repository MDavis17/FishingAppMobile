import { useState, useEffect, useRef } from "react";
import { GooglePlacesAPIKey } from "common/api/config";
import { Keyboard } from "react-native";
import { LatLng } from "react-native-maps";
import { getPlaceSuggestions } from "common/api/getPlaceSuggestions";
import { getPlaceDetails } from "common/api/getPlaceDetails";

export default function useCustomPlacesInput(
  onLocationSelect: (location: LatLng) => void
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef();

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

  const handleSelect = async (item) => {
    try {
      const response = await getPlaceDetails(item.place_id);
      if (!response.ok) {
        throw response;
      }

      const location = response.data.result?.geometry?.location;
      if (location) {
        setQuery(item.description);
        setResults([]);
        setShowResults(false);
        inputRef.current?.blur();
        Keyboard.dismiss();

        setTimeout(() => setShowResults(false), 500);

        onLocationSelect({
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        // maybe some better alerting for the user
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
