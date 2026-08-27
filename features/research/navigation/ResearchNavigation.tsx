import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import Research from "../components/Research";
import SpeciesList from "../components/SpeciesList";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ResearchNavigation() {
  const theme = useTheme();

  const primaryHeaderOptions = {
    headerStyle: { backgroundColor: theme.colors.primary },
    headerTintColor: theme.colors.onPrimary,
    headerTitleStyle: { color: theme.colors.onPrimary },
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Research" component={Research} />
      <Stack.Screen
        name="SpeciesList"
        component={SpeciesList}
        options={{
          headerShown: true,
          headerTitle: "Species",
          ...primaryHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}
