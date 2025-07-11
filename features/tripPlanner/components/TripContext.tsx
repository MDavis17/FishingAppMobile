import React, { createContext, useContext, useState, ReactNode } from "react";
import { Trip } from "types";

type TripContextType = {
  trip: Trip | null;
  setTrip: (trip: Trip | null) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trip, setTrip] = useState<Trip | null>(null);

  return (
    <TripContext.Provider value={{ trip, setTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
};
