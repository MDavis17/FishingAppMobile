import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import LogListTabs from "../components/LogListTabs";
import TripDetail from "features/tripPlanner/components/TripDetail";
import NewTripForm from "features/tripPlanner/components/NewTripForm";
import { useTheme } from "react-native-paper";
import AddCatchForm from "../components/AddCatchForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  const theme = useTheme();
  const basicOptions = {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.onPrimary,
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Fishing Log"
        component={LogListTabs}
        options={basicOptions}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetail}
        options={{
          ...basicOptions,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTripForm}
        options={{
          ...basicOptions,
          presentation: "modal",
          title: "New Trip",
        }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{
          ...basicOptions,
          title: "Select Location",
        }}
      />
      <Stack.Screen
        name="AddNewCatch"
        component={AddCatchForm}
        options={{ presentation: "modal", title: "New Catch" }}
      />
    </Stack.Navigator>
  );
}
