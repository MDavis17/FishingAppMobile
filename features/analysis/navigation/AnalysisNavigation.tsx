import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { useTheme } from "react-native-paper";
import SpeciesList from "../components/SpeciesList";

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
    </Stack.Navigator>
  );
}
