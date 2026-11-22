import { LatLng, Trip } from "types";

export type SavedLocationChange = {
  tripId: number;
  savedLocationId: number | null;
  coordinates: LatLng;
};

const COORD_MATCH_EPSILON = 0.00001;

type Listener = (change: SavedLocationChange) => void;

const listeners = new Set<Listener>();
let mutationEpoch = 0;
let pendingChange: SavedLocationChange | null = null;
let lastChange: SavedLocationChange | null = null;

export function getSavedLocationMutationEpoch() {
  return mutationEpoch;
}

export function settleSavedLocationChange() {
  pendingChange = null;
}

function changeToOverlay(epochAtStart: number): SavedLocationChange | null {
  if (pendingChange && mutationEpoch >= epochAtStart) {
    return pendingChange;
  }
  if (lastChange && mutationEpoch > epochAtStart) {
    return lastChange;
  }
  return null;
}

export function subscribeSavedLocationChange(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifySavedLocationChange(change: SavedLocationChange) {
  mutationEpoch += 1;
  pendingChange = change;
  lastChange = change;
  listeners.forEach((listener) => listener(change));
}

export function coordinatesMatch(a: LatLng, b: LatLng) {
  return (
    Math.abs(a.latitude - b.latitude) < COORD_MATCH_EPSILON &&
    Math.abs(a.longitude - b.longitude) < COORD_MATCH_EPSILON
  );
}

export function tripMatchesSavedLocationChange(
  trip: Pick<Trip, "id" | "location">,
  change: SavedLocationChange,
) {
  return (
    trip.id === change.tripId ||
    coordinatesMatch(trip.location.coordinates, change.coordinates)
  );
}

export function applySavedLocationChangeToTrips(
  trips: Trip[],
  change: SavedLocationChange,
): Trip[] {
  return trips.map((trip) =>
    tripMatchesSavedLocationChange(trip, change)
      ? { ...trip, savedLocationId: change.savedLocationId }
      : trip,
  );
}

export function applySavedLocationChangeToTrip(
  trip: Trip | null,
  change: SavedLocationChange,
): Trip | null {
  if (!trip || !tripMatchesSavedLocationChange(trip, change)) {
    return trip;
  }
  return { ...trip, savedLocationId: change.savedLocationId };
}

export function overlaySavedLocationOnTrips(
  trips: Trip[],
  epochAtStart: number,
): Trip[] {
  const change = changeToOverlay(epochAtStart);
  if (!change) {
    return trips;
  }
  return applySavedLocationChangeToTrips(trips, change);
}

export function overlaySavedLocationOnTrip(
  trip: Trip | null,
  epochAtStart: number,
): Trip | null {
  const change = changeToOverlay(epochAtStart);
  if (!change) {
    return trip;
  }
  return applySavedLocationChangeToTrip(trip, change);
}