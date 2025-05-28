import { RequestMethod } from "common/api/types";
import { unauthenticatedFetch } from "../../../common/api/request";
import { CatchEntry } from "types";

export const addNewCatchLog = async (newCatch: CatchEntry) => {
  return await unauthenticatedFetch(`catchLog/`, {
    method: RequestMethod.POST,
    body: JSON.stringify(newCatch),
  });
};
