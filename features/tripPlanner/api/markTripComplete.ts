import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const markTripComplete = async (tripId: number) => {
  return await authenticatedFetch(`trips/${tripId}/markAsCompleted`, {
    method: RequestMethod.PUT,
  });
};
