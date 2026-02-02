import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const markTripCompletedById = async (id: number) => {
  return await unauthenticatedFetch(`trips/${id}/markAsCompleted`, {
    method: RequestMethod.PUT,
    body: JSON.stringify({ status: "Completed" }),
  });
};
