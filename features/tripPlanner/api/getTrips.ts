import { authenticatedFetch } from "../../../common/api/request";

export const getTrips = async () => {
  return await authenticatedFetch("trips/");
};
