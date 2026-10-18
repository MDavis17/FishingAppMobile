import { authenticatedFetch } from "../../../common/api/request";

export const getCatchLogs = async () => {
  return await authenticatedFetch(`catch/`);
};
