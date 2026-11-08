import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const updateTripNotes = async (tripId: number, notes: string) => {
  return await authenticatedFetch(`trips/${tripId}/notes`, {
    method: RequestMethod.PUT,
    body: JSON.stringify({ notes }),
  });
};
