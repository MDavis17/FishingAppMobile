import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import UserSettings from "features/settings/components/UserSettings";
import AnglerHome from "../components/AnglerHome";
import ThemeSettings from "features/settings/components/ThemeSettings";
import NewTripModal from "features/tripPlanner/components/NewTripModal";
import SelectLocation from "common/components/SelectLocation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeNavigation() {
  const theme = useTheme();

  const primaryHeaderOptions = {
    headerStyle: { backgroundColor: theme.colors.primary },
    headerTintColor: theme.colors.onPrimary,
    headerTitleStyle: { color: theme.colors.onPrimary },
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={AnglerHome} />
      <Stack.Screen name="Settings" component={UserSettings} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
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
