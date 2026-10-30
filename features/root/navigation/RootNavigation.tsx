import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import MainAppTabs from "../components/MainAppTabs";
import OnboardingCarousel from "features/onboarding/components/OnboardingCarousel";
import AuthNavigation from "features/auth/navigation/AuthNavigation";
import UserSettings from "features/settings/components/UserSettings";
import ThemeSettings from "features/settings/components/ThemeSettings";
import { useAuth } from "common/context/AuthContext";
import { RootStackParamList } from "types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const theme = useTheme();

  const primaryHeaderOptions = {
    headerStyle: { backgroundColor: theme.colors.primary },
    headerTintColor: theme.colors.onPrimary,
    headerTitleStyle: { color: theme.colors.onPrimary },
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigation />;
  }

  if (!hasOnboarded) {
    return <OnboardingCarousel onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={MainAppTabs} />
      <Stack.Screen
        name="Settings"
        component={UserSettings}
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerBackTitle: "Back",
          ...primaryHeaderOptions,
        }}
      />
      <Stack.Screen
        name="ThemeSettings"
        component={ThemeSettings}
        options={{
          headerShown: true,
          headerTitle: "Theme",
          ...primaryHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
