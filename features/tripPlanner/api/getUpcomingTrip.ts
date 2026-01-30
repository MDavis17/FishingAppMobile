import { unauthenticatedFetch } from "../../../common/api/request";

export const getUpcomingTrip = async () => {
  return await unauthenticatedFetch(`trips/upcomingTrip/`);
};
