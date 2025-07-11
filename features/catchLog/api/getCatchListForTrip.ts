import { unauthenticatedFetch } from "../../../common/api/request";

export const getCatchListForTrip = async (tripId: number) => {
  return await unauthenticatedFetch(`trips/${tripId}/catchList`);
};
