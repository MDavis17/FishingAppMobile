import { authenticatedFetch } from "common/api/request";

export const getSpeciesCatchHistory = async (speciesId: number) => {
  return await authenticatedFetch(`species/${speciesId}/catch-history`);
};
