import * as React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text, useTheme } from "react-native-paper";
import TripList from "features/tripPlanner/components/TripList";
import { useRoute, useFocusEffect } from "@react-navigation/native";

export default function LogListTabs() {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const route = useRoute();

  const initialTab = (route.params as { initialTab?: string })?.initialTab;
  const initialIndex = initialTab === "analysis" ? 1 : 0;

  const [index, setIndex] = React.useState(initialIndex);
  const hasAppliedInitialTab = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      const params = route.params as { initialTab?: string } | undefined;
      if (params?.initialTab === "analysis" && !hasAppliedInitialTab.current) {
        setIndex(1);
        hasAppliedInitialTab.current = true;
      } else if (!params?.initialTab) {
        hasAppliedInitialTab.current = false;
      }
    }, [route.params])
  );
  const [routes] = React.useState([
    { key: "log", title: "Fishing Log" },
    { key: "analysis", title: "Analysis" },
  ]);

  const pageStyles = [
    styles.scene,
  ];

  const AllLogsRoute = () => (
    <View style={pageStyles}>
      <TripList />
    </View>
  );

  const BySpeciesRoute = () => (
    <View style={pageStyles}>
      <Text>Grouped by species</Text>
    </View>
  );

  const renderScene = SceneMap({
    log: AllLogsRoute,
    analysis: BySpeciesRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{ backgroundColor: theme.colors.secondary }}
          activeColor={theme.colors.primary}
          inactiveColor={"white"}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, padding: 8 },
});
