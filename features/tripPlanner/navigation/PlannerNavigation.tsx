import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import TripList from "../components/TripList";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function PlannerNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Plan" component={TripList} />
    </Stack.Navigator>
  );
}
