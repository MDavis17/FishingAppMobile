import { unauthenticatedFetch } from "../../../common/api/request";

export const getTrips = async () => {
  return await unauthenticatedFetch(`trips/`);
};
