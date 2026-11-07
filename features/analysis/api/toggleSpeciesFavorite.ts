import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const toggleSpeciesFavorite = async (speciesId: number) => {
  return await authenticatedFetch(`species/${speciesId}/favorite`, {
    method: RequestMethod.PUT,
  });
};
