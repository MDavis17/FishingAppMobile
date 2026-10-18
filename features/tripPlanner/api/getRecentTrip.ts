import { authenticatedFetch } from "../../../common/api/request";

export const getRecentTrip = async () => {
  return await authenticatedFetch(`trips/mostRecentTrip`);
};
