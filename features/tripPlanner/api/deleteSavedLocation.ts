import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";

export const deleteSavedLocation = async (locationId: number) => {
  return await authenticatedFetch(`locations/${locationId}`, {
    method: RequestMethod.DELETE,
  });
};