export interface CatchEntry {
  id: number;
  dateTime: string;
  species: string;
  weight?: number;
  length?: number;
  fisheryType: FisheryType;
}

export interface CatchTime {
  hours: number;
  minutes: number;
}

export enum FisheryType {
  Freshwater = "Freshwater",
  Saltwater = "Saltwater",
  Brackish = "Brackish",
}
