export const SPECIES_GROUPS = [
  "bass",
  "baitfish",
  "crab",
  "croaker",
  "eel",
  "flatfish",
  "greenling",
  "groundfish",
  "pelagic",
  "perch",
  "ray",
  "rockfish",
  "salmon",
  "scorpionfish",
  "seagrass",
  "shark",
  "shellfish",
  "sturgeon",
  "surfperch",
  "wrasse",
] as const;

export type SpeciesGroupType = (typeof SPECIES_GROUPS)[number];