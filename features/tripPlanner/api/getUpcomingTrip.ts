import { authenticatedFetch } from "../../../common/api/request";

export const getUpcomingTrip = async () => {
  return await authenticatedFetch(`trips/upcomingTrip`);
};
