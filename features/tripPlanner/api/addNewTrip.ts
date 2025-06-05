import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";
import { Trip } from "types";

export const addNewTrip = async (newTrip: Trip) => {
  return await unauthenticatedFetch(`trips/`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newTrip),
  });
};
