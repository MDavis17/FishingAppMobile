import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import SpeciesList from "../components/SpeciesList";
import SpeciesDetail from "../components/SpeciesDetail";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AnalysisNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Analysis" component={SpeciesList} />
      <Stack.Screen name="SpeciesDetail" component={SpeciesDetail} />
    </Stack.Navigator>
  );
}
