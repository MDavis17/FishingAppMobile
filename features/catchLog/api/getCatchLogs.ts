import { unauthenticatedFetch } from "../../../common/api/request";

export const getCatchLogs = async () => {
  return await unauthenticatedFetch(`catchLog/`);
};
