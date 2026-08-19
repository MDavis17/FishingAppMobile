import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Location } from "types";

const STORAGE_KEY = "selected-location";

interface LocationContextProps {
  location: Location | null;
  setLocation: (location: Location) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextProps>({
  location: null,
  setLocation: () => {},
  isLoading: true,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocationState] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLocationState(JSON.parse(stored));
        }
      } catch (err) {
        console.error("LocationContext: failed to load saved location", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setLocation = async (newLocation: Location) => {
    setLocationState(newLocation);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
    } catch (err) {
      console.error("LocationContext: failed to persist location", err);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};
