import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";
import { CatchEntry } from "types";

export const addNewCatchToTrip = async (
  tripId: number,
  newCatch: CatchEntry
) => {
  return await unauthenticatedFetch(`trips/${tripId}/addCatch`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newCatch),
  });
};
