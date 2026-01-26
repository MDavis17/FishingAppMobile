import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import UserSettings from "features/settings/components/UserSettings";
import AnglerHome from "../components/AnglerHome";
import ThemeSettings from "features/settings/components/ThemeSettings";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeNavigation() {
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
        name="Home"
        component={AnglerHome}
        options={({ navigation }) => ({
          ...basicOptions,
          headerRight: () => (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <MaterialCommunityIcons
                name="cog"
                size={24}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={UserSettings}
        options={basicOptions}
      />
      <Stack.Screen
        name="ThemeSettings"
        component={ThemeSettings}
        options={{
          ...basicOptions,
          headerRight: () => (
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  settingsButton: { paddingRight: 16 },
  saveButton: { fontSize: 18, fontWeight: "400", color: "white" },
});
