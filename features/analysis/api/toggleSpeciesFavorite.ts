import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";

export const toggleSpeciesFavorite = async (speciesId: number) => {
  return await unauthenticatedFetch(`species/${speciesId}/favorite`, {
    method: RequestMethod.PUT,
  });
};
