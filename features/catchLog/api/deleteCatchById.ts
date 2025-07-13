import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const deleteCatchById = async (id: number) => {
  return await unauthenticatedFetch(`catch/${id}`, {
    method: RequestMethod.DELETE,
  });
};
