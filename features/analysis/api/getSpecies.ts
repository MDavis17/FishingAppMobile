import { unauthenticatedFetch } from "../../../common/api/request";

export const getSpecies = async () => {
  return await unauthenticatedFetch(`species/`);
};
