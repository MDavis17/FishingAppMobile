import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import TripList from "../components/TripList";
import TripDetail from "../components/TripDetail";
import NewTripForm from "../components/NewTripForm";
import SelectLocation from "common/components/SelectLocation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function PlannerNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Plan" component={TripList} />
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
    </Stack.Navigator>
  );
}
