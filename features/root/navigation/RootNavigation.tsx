import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainAppTabs from "../components/MainAppTabs";
import OnboardingCarousel from "features/onboarding/components/OnboardingCarousel";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const [hasOnboarded, setHasOnboarded] = useState(false); // Replace with isnewUser
  if (!hasOnboarded) {
    return <OnboardingCarousel onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={MainAppTabs} />
    </Stack.Navigator>
  );
}
