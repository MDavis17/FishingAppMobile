import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import NewTripModal from "../components/NewTripModal";
import TripDetail from "../components/TripDetail";
import TripList from "../components/TripList";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function TripsNavigation() {
  const theme = useTheme();

  const primaryHeaderOptions = {
    headerStyle: { backgroundColor: theme.colors.primary },
    headerTintColor: theme.colors.onPrimary,
    headerTitleStyle: { color: theme.colors.onPrimary },
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Trips" component={TripList} />
      <Stack.Screen
        name="NewTrip"
        component={NewTripModal}
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "New Trip",
          ...primaryHeaderOptions,
        }}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetail}
        options={{
          headerShown: true,
          headerTitle: "",
          ...primaryHeaderOptions,
        }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{
          headerShown: true,
          headerTitle: "Select Location",
          ...primaryHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}
