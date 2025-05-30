import { googlePlacesFetch } from "./request";

export const getPlaceSuggestions = async (input: string) => {
  const queryString = `input=${input}&language=en`;
  return await googlePlacesFetch(`autocomplete/json`, queryString);
};
