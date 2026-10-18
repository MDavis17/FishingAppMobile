import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";
import { CatchEntry } from "types";

export const addNewCatchToTrip = async (
  tripId: number,
  newCatch: CatchEntry
) => {
  return await authenticatedFetch(`trips/${tripId}/addCatch`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newCatch),
  });
};
