import { authenticatedFetch } from "../../../common/api/request";

export const getSavedLocations = async () => {
  return await authenticatedFetch("locations/");
};