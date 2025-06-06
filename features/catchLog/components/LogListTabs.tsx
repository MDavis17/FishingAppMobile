import * as React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text, useTheme } from "react-native-paper";
import TripList from "features/tripPlanner/components/TripList";

export default function LogListTabs() {
  const layout = useWindowDimensions();
  const theme = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "log", title: "Fishing Log" },
    { key: "analysis", title: "Analysis" },
  ]);

  const pageStyles = [
    styles.scene,
    { backgroundColor: theme.colors.background },
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
          style={{ backgroundColor: theme.colors.background }}
          activeColor={theme.colors.primary}
          inactiveColor={"black"}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1, padding: 8 },
});
