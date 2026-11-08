import { TripType } from "types";

export const TRIP_TYPE_ICONS: Record<TripType, string> = {
  [TripType.Surf]: "tower-beach",
  [TripType.Kayak]: "kayaking",
  [TripType.Boat]: "sail-boat",
  [TripType.Spearfishing]: "spear",
  [TripType.Pier]: "pier",
  [TripType.FreeDiving]: "diving-flippers",
  [TripType.Crabbing]: "bucket",
  [TripType.RockJetty]: "terrain",
  [TripType.FlyFishing]: "hook",
};
