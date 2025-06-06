import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import LogListTabs from "../components/LogListTabs";
import TripDetail from "features/tripPlanner/components/TripDetail";
import NewTripForm from "features/tripPlanner/components/NewTripForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fishing Log" component={LogListTabs} />
      <Stack.Screen
        name="TripDetail"
        component={TripDetail}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTripForm}
        options={{ presentation: "modal", title: "New Trip" }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{ title: "Select Location" }}
      />
      {/* <Stack.Screen
        name="CatchDetail"
        component={CatchDetail}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddNewCatch"
        component={AddCatchForm}
        options={{ presentation: "modal", title: "New Catch" }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{ title: "Select Location" }}
      /> */}
    </Stack.Navigator>
  );
}
