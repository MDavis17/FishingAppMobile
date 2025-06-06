import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const deleteTripById = async (id: number) => {
  return await unauthenticatedFetch(`trips/${id}`, {
    method: RequestMethod.DELETE,
  });
};
