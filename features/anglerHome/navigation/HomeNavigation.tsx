import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import UserSettings from "features/settings/components/UserSettings";
import AnglerHome from "../components/AnglerHome";
import ThemeSettings from "features/settings/components/ThemeSettings";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={AnglerHome} />
      <Stack.Screen name="Settings" component={UserSettings} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
    </Stack.Navigator>
  );
}
