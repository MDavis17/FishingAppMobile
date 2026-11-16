import type { TripConditions } from "common/api/getTripConditions";

export type TripForecast = Omit<TripConditions, "source">;