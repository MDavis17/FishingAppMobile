import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import SelectLocation from "common/components/SelectLocation";
import AddCatchForm from "features/catchLog/components/AddCatchForm";
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
        name="TripDetail"
        component={TripDetail}
        options={({ route }) => ({
          presentation: "modal",
          headerShown: true,
          headerTitle: route.params.trip.location.name,
          ...primaryHeaderOptions,
        })}
      />
      <Stack.Screen
        name="AddNewCatch"
        component={AddCatchForm}
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Log Catch",
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
