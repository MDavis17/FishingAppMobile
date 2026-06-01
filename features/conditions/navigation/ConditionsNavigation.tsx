import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import Conditions from "../components/Conditions";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ConditionsNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Conditions" component={Conditions} />
    </Stack.Navigator>
  );
}
