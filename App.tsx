import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import LogList from "./features/catchLog/components/LogList";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnglerHome from "features/anglerHome/AnglerHome";
import TripPlanner from "features/tripPlanner/TripPlanner";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = "home";
                } else if (route.name === "Logs") {
                  iconName = "clipboard-list";
                } else if (route.name === "Trip") {
                  iconName = "map-marker-path";
                }

                return (
                  <MaterialCommunityIcons
                    name={iconName as any}
                    size={size}
                    color={color}
                  />
                );
              },
              tabBarActiveTintColor: "#0077cc",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Home" component={AnglerHome} />
            <Tab.Screen name="Logs" component={LogList} />
            <Tab.Screen name="Trip" component={TripPlanner} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
