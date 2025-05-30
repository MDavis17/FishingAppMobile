import { googlePlacesFetch } from "./request";

export const getPlaceDetails = async (placeId: string) => {
  const queryString = `place_id=${placeId}`;
  return await googlePlacesFetch(`details/json`, queryString);
};
