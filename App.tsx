import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigation from "features/root/navigation/RootNavigation";
import { useColorScheme } from "react-native";
import { ThemeProvider, useAppTheme } from "common/theme/ThemeContext";
import { TripProvider } from "features/tripPlanner/components/TripContext";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const ThemedApp = () => {
  const { themeName, theme } = useAppTheme();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <TripProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <ThemedApp />
            </ThemeProvider>
          </SafeAreaProvider>
        </TripProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
