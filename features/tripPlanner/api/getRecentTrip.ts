import { unauthenticatedFetch } from "../../../common/api/request";

export const getRecentTrip = async () => {
  return await unauthenticatedFetch(`trips/mostRecentTrip/`);
};
