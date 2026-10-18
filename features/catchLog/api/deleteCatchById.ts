import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const deleteCatchById = async (id: number) => {
  return await authenticatedFetch(`catch/${id}`, {
    method: RequestMethod.DELETE,
  });
};
