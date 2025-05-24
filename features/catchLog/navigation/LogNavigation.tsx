import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogList from "../components/LogList";
import CatchDetail from "../components/CatchDetail";
import { RootStackParamList } from "types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fishing Log" component={LogList} />
      <Stack.Screen name="CatchDetail" component={CatchDetail} />
    </Stack.Navigator>
  );
}
