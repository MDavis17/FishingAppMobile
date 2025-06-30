import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import LogListTabs from "../components/LogListTabs";
import TripDetail from "features/tripPlanner/components/TripDetail";
import NewTripForm from "features/tripPlanner/components/NewTripForm";
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Fishing Log"
        component={LogListTabs}
        options={{
          headerStyle: {
            backgroundColor: theme.colors.surfaceVariant,
          },
          headerTintColor: theme.colors.onSurface,
        }}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetail}
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: theme.colors.surfaceVariant,
          },
          headerTintColor: theme.colors.onSurface,
        }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTripForm}
        options={{
          presentation: "modal",
          title: "New Trip",
          headerStyle: {
            backgroundColor: theme.colors.surfaceVariant,
          },
          headerTintColor: theme.colors.onSurface,
        }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{
          title: "Select Location",
          headerStyle: {
            backgroundColor: theme.colors.surfaceVariant,
          },
          headerTintColor: theme.colors.onSurface,
        }}
      />
    </Stack.Navigator>
  );
}
