import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainAppTabs from "../components/MainAppTabs";
import OnboardingCarousel from "features/onboarding/components/OnboardingCarousel";
import AuthNavigation from "features/auth/navigation/AuthNavigation";
import { useAuth } from "common/context/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState(false);

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
