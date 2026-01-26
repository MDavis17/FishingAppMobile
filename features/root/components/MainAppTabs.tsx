import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnglerHome from "features/anglerHome/components/AnglerHome";
import LogNavigation from "features/catchLog/navigation/LogNavigation";
import PlannerNavigation from "features/tripPlanner/navigation/PlannerNavigation";
import { useTheme } from "react-native-paper";
import { StyleSheet, TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function MainAppTabs() {
  const theme = useTheme();
  const basicScreenOptions = {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.onPrimary,
  };
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.surface },
      })}
    >
      <Tab.Screen
        name="Home"
        component={AnglerHome}
        options={{
          ...basicScreenOptions,
          headerRight: () => (
            <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
              <MaterialCommunityIcons
                name="cog"
                size={24}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          ),
        }}
      />
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

const styles = StyleSheet.create({
  settingsButton: { paddingRight: 16 },
});
