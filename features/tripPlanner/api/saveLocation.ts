import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";
import { SavedLocationCreatePayload } from "types";

export const saveLocation = async (payload: SavedLocationCreatePayload) => {
  return await authenticatedFetch("locations/", {
    method: RequestMethod.POST,
    body: JSON.stringify(payload),
  });
};