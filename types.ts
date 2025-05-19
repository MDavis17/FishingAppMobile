export interface CatchEntry {
  id: number;
  dateTime: string;
  species: string;
  weight?: number;
  length?: number;
  fisheryType: FisheryType;
}

export enum FisheryType {
  Freshwater = 0,
  Saltwater = 1,
  Brackish = 2,
}
