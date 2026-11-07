import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const deleteTrip = async (tripId: number) => {
  return await authenticatedFetch(`trips/${tripId}`, {
    method: RequestMethod.DELETE,
  });
};
