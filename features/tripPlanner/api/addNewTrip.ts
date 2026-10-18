import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";
import { Location } from "types";

export type CreateTripPayload = {
  date: string;
  location: Location;
  status: "Planned" | "Completed";
  targetSpecies?: { id: number; name: string }[];
};

export const addNewTrip = async (newTrip: CreateTripPayload) => {
  return await authenticatedFetch(`trips/`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newTrip),
  });
};
