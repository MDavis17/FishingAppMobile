import { authenticatedFetch } from "../../../common/api/request";

export type SpeciesSort = "name_asc" | "name_desc";
export type SpeciesCaughtFilter = "caught" | "uncaught";

export type GetSpeciesParams = {
  kingdom?: string;
  search?: string;
  caught?: SpeciesCaughtFilter;
  favoritesOnly?: boolean;
  sort?: SpeciesSort;
  groups?: string[];
};

function buildSpeciesQuery(params?: GetSpeciesParams): string {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();
  if (params.kingdom) {
    query.set("kingdom", params.kingdom);
  }
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.caught) {
    query.set("caught", params.caught);
  }
  if (params.favoritesOnly) {
    query.set("favoritesOnly", "true");
  }
  if (params.sort && params.sort !== "name_asc") {
    query.set("sort", params.sort);
  }
  if (params.groups && params.groups.length > 0) {
    query.set("groups", params.groups.join(","));
  }

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const getSpecies = async (params?: GetSpeciesParams) => {
  const query = buildSpeciesQuery(params);
  return await authenticatedFetch(`species/${query}`);
};