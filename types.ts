export interface CatchEntry {
  id?: number;
  dateTime: string;
  species: string;
  weight?: number;
  length?: number;
  waterType: WaterType;
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
  TripPlanning: undefined;
  CatchDetail: { catchItem: CatchEntry; deleteCatch: () => void };
};
