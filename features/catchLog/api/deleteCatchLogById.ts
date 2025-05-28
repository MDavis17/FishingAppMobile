import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const deleteCatchLogById = async (id: number) => {
  return await unauthenticatedFetch(`catchLog/${id}`, {
    method: RequestMethod.DELETE,
  });
};
