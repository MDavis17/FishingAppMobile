import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";
import { Location, TripType } from "types";

export type CreateTripPayload = {
  date: string;
  location: Location;
  status: "Planned" | "Completed";
  tripType: TripType;
  targetSpecies?: { id: number; name: string }[];
};

export const addNewTrip = async (newTrip: CreateTripPayload) => {
  return await authenticatedFetch(`trips/`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newTrip),
  });
};
