import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import TripDetail from "features/tripPlanner/components/TripDetail";
import NewTripForm from "features/tripPlanner/components/NewTripForm";
import AddCatchForm from "../components/AddCatchForm";
import TripList from "features/tripPlanner/components/TripList";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Fishing Log" component={TripList} />
      <Stack.Screen
        name="TripDetail"
        component={TripDetail}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTripForm}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
      />
      <Stack.Screen
        name="AddNewCatch"
        component={AddCatchForm}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
