import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const deleteTrip = async (tripId: number) => {
  return await unauthenticatedFetch(`trips/${tripId}`, {
    method: RequestMethod.DELETE,
  });
};
