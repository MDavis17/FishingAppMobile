import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const markTripComplete = async (tripId: number) => {
  return await unauthenticatedFetch(`trips/${tripId}/markAsCompleted`, {
    method: RequestMethod.PUT,
  });
};
