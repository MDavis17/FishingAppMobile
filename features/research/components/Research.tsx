import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import ExploreCard from "./ExploreCard";

export default function Research() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          Research
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Learn, explore, and improve your time on the water.
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.exploreText}>Explore</Text>
        <View style={styles.exploreContent}>
          <View style={styles.exploreRow}>
            <ExploreCard
              title="Species"
              description="Fish and invertebrates"
              icon={require("common/assets/species-icon.png")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: 500,
    alignSelf: "flex-start",
  },
  exploreContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exploreRow: {
    flexDirection: "row",
  },
});
