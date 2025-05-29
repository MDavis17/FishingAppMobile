import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogList from "../components/LogList";
import CatchDetail from "../components/CatchDetail";
import { RootStackParamList } from "types";
import AddCatchForm from "../components/AddCatchForm";
import SelectLocation from "common/components/SelectLocation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function LogNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Fishing Log" component={LogList} />
      <Stack.Screen
        name="CatchDetail"
        component={CatchDetail}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddNewCatch"
        component={AddCatchForm}
        options={{ presentation: "modal", title: "New Catch" }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{ title: "Select Location" }}
      />
    </Stack.Navigator>
  );
}
