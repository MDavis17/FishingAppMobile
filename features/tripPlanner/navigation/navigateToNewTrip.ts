import {
  CommonActions,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { SavedLocation, TripType } from "types";

export type NewTripPresetLocation = {
  name: string;
  coordinates: { latitude: number; longitude: number };
  generalLocationName?: string | null;
  tripType?: TripType | null;
};

export function presetFromSavedLocation(
  saved: SavedLocation,
): NewTripPresetLocation {
  return {
    name: saved.location.name,
    coordinates: saved.location.coordinates,
    generalLocationName: saved.location.generalLocationName,
    tripType: saved.tripType ?? null,
  };
}

export function navigateToNewTripWithPreset(
  navigation: NavigationProp<ParamListBase>,
  presetLocation: NewTripPresetLocation,
) {
  const tabNavigation = navigation.getParent() ?? navigation;
  const tabState = tabNavigation.getState();
  if (!tabState?.routes?.length) {
    tabNavigation.dispatch(
      CommonActions.navigate({
        name: "Trips",
        params: {
          screen: "NewTrip",
          params: { presetLocation },
        },
      }),
    );
    return;
  }

  const routes = tabState.routes.map((route) => {
    if (route.name !== "Trips") {
      return route;
    }
    return {
      ...route,
      state: {
        index: 1,
        routes: [
          { name: "Trips" },
          { name: "NewTrip", params: { presetLocation } },
        ],
      },
    };
  });

  const tripsTabIndex = routes.findIndex((r) => r.name === "Trips");

  tabNavigation.dispatch({
    ...CommonActions.reset({
      ...tabState,
      index: tripsTabIndex >= 0 ? tripsTabIndex : tabState.index,
      routes,
    }),
  });
}