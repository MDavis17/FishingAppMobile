import { unauthenticatedFetch } from "../../../common/api/request";

export const getSpeciesRange = async (speciesId: number) => {
  return await unauthenticatedFetch(`species/${speciesId}/range`);
};
