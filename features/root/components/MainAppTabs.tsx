import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import HomeNavigation from "features/anglerHome/navigation/HomeNavigation";
import AppHeader from "common/components/AppHeader";
import ConditionsNavigation from "features/conditions/navigation/ConditionsNavigation";
import TripsNavigation from "features/tripPlanner/navigation/TripsNavigation";

const Tab = createBottomTabNavigator();

export default function MainAppTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Trips") {
            iconName = "calendar";
          } else if (route.name === "Conditions") {
            iconName = "weather-cloudy";
          }

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        header: () => <AppHeader />,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Trips" component={TripsNavigation} />
      <Tab.Screen name="Conditions" component={ConditionsNavigation} />
    </Tab.Navigator>
  );
}
