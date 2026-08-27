import { unauthenticatedFetch } from "../../../common/api/request";

export const getSpecies = async (kingdom?: string) => {
  const query = kingdom ? `?kingdom=${encodeURIComponent(kingdom)}` : "";
  return await unauthenticatedFetch(`species/${query}`);
};
