import { authenticatedFetch } from "../../../common/api/request";

export const getCatchListForTrip = async (tripId: number) => {
  return await authenticatedFetch(`trips/${tripId}/catchList`);
};
