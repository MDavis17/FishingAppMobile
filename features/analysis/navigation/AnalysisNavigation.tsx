import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { useTheme } from "react-native-paper";
import SpeciesList from "../components/SpeciesList";
import SpeciesDetail from "../components/SpeciesDetail";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AnalysisNavigation() {
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
        name="Analysis"
        component={SpeciesList}
        options={basicOptions}
      />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetail}
        options={({ route }) => ({
          ...basicOptions,
          title:
            (route.params as { species: { name: string } })?.species?.name ??
            "Species",
        })}
      />
    </Stack.Navigator>
  );
}
