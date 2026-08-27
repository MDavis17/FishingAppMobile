import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import Research from "../components/Research";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ResearchNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Research" component={Research} />
    </Stack.Navigator>
  );
}
