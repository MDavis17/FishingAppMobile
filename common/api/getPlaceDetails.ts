import { googlePlacesFetch } from "./request";

export const getPlaceDetails = async (placeId: string) => {
  const queryString = `place_id=${placeId}&fields=geometry,name,address_components`;
  return await googlePlacesFetch(`details/json`, queryString);
};
