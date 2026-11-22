import { RequestMethod } from "common/api/types";
import { authenticatedFetch } from "../../../common/api/request";
import { LatLng } from "types";

export const deleteSavedLocation = async (
  locationId: number,
  coordinates?: LatLng,
  tripId?: number,
) => {
  const params = new URLSearchParams();
  if (coordinates) {
    params.set("latitude", String(coordinates.latitude));
    params.set("longitude", String(coordinates.longitude));
  }
  if (tripId !== undefined) {
    params.set("tripId", String(tripId));
  }
  const query = params.toString();
  return await authenticatedFetch(
    `locations/${locationId}${query ? `?${query}` : ""}`,
    {
      method: RequestMethod.DELETE,
    },
  );
};