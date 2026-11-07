import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigation from "features/root/navigation/RootNavigation";
import { ThemeProvider, useAppTheme } from "common/theme/ThemeContext";
import { TripProvider } from "features/tripPlanner/components/TripContext";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { LocationProvider } from "common/context/LocationContext";
import { AuthProvider } from "common/context/AuthContext";

const ThemedApp = () => {
  const { theme } = useAppTheme();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ActionSheetProvider>
          <TripProvider>
            <SafeAreaProvider>
              <ThemeProvider>
                <LocationProvider>
                  <ThemedApp />
                </LocationProvider>
              </ThemeProvider>
            </SafeAreaProvider>
          </TripProvider>
        </ActionSheetProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
