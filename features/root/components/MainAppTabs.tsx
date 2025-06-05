import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnglerHome from "features/anglerHome/AnglerHome";
import LogNavigation from "features/catchLog/navigation/LogNavigation";
import PlannerNavigation from "features/tripPlanner/navigation/PlannerNavigation";

const Tab = createBottomTabNavigator();

export default function MainAppTabs() {
  return (
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
      <Tab.Screen
        name="Plan"
        component={PlannerNavigation}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
