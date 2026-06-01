import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LogNavigation from "features/catchLog/navigation/LogNavigation";
import PlannerNavigation from "features/tripPlanner/navigation/PlannerNavigation";
import { useTheme } from "react-native-paper";
import HomeNavigation from "features/anglerHome/navigation/HomeNavigation";
import AnalysisNavigation from "features/analysis/navigation/AnalysisNavigation";
import AppHeader from "common/components/AppHeader";

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
          } else if (route.name === "Fishing Log") {
            iconName = "book-outline";
          } else if (route.name === "Analysis") {
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        header: () => <AppHeader />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
      />
      {/* <Tab.Screen
        name="Fishing Log"
        component={LogNavigation}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisNavigation}
      />
      <Tab.Screen
        name="Plan"
        component={PlannerNavigation}
      /> */}
    </Tab.Navigator>
  );
}
