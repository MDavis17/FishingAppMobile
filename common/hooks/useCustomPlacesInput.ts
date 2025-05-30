import { useState, useEffect, useRef } from "react";
import { GooglePlacesAPIKey } from "common/api/config";
import { Keyboard } from "react-native";
import { LatLng } from "react-native-maps";

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
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&key=${GooglePlacesAPIKey}&language=en`
        );
        const json = await res.json();

        if (!cancelled && json.status === "OK") {
          setResults(json.predictions || []);
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
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GooglePlacesAPIKey}`
      );
      const json = await res.json();
      const location = json.result?.geometry?.location;

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
