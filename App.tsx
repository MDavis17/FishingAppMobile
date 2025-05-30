import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnglerHome from "features/anglerHome/AnglerHome";
import TripPlanner from "features/tripPlanner/TripPlanner";
import LogNavigation from "features/catchLog/navigation/LogNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;

                  if (route.name === "Home") {
                    iconName = "home";
                  } else if (route.name === "Fishing Log") {
                    iconName = "book-outline";
                  } else if (route.name === "Plan") {
                    iconName = "map-clock-outline";
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
              <Tab.Screen
                name="Fishing Log"
                component={LogNavigation}
                options={{ headerShown: false }}
              />
              <Tab.Screen name="Plan" component={TripPlanner} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
