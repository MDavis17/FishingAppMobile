import { LatLng } from "react-native-maps";

export interface Location {
  name: string;
  coordinates: LatLng;
}

export interface CatchEntry {
  id?: number;
  dateTime: string;
  species: string;
  weight?: number;
  length?: number;
  waterType: WaterType;
  location?: Location;
  bait?: string;
}

export interface Trip {
  id: number;
  date: string;
  waterType: WaterType;
  location: Location;
  catchList: CatchEntry[];
  catchSummary: string;
}

export interface CatchTime {
  hours: number;
  minutes: number;
}

export interface InputError {
  inputId: string;
  message: string;
}

export enum WaterType {
  Freshwater = "Freshwater",
  Saltwater = "Saltwater",
  Brackish = "Brackish",
}

export type RootStackParamList = {
  Home: undefined;
  Logs: undefined;
  CatchDetail: { catchItem: CatchEntry; deleteCatch: () => void };
  AddNewCatch: { addNewCatch: (catchData: CatchEntry) => void };
  SelectLocation: {
    initialLocation: LatLng;
    onLocationSelected: (newLocation: LatLng) => void;
  };
  Plan: undefined;
  TripDetail: { trip: Trip; deleteTrip: () => void };
  NewTrip: { createNewTrip: (newTrip: Trip) => void };
};

export enum UserUnits {
  Imperial = "Imperial",
  Metric = "Metric",
}

export enum TempUnits {
  Fahrenheit = "F",
  Celsius = "C",
}
