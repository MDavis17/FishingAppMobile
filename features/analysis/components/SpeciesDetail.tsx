import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "types";

type SpeciesAnalysisRouteProp = RouteProp<RootStackParamList, "SpeciesDetail">;

export default function SpeciesDetail() {
  const theme = useTheme();
  const route = useRoute<SpeciesAnalysisRouteProp>();
  const { species } = route.params;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.speciesName}>
          {species.name}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waterTypeTag: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  speciesName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  identificationContainer: { flex: 1, paddingVertical: 6 },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  speciesImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetsContainer: { flex: 1 },
  sectionTitle: { marginBottom: 8, fontWeight: "bold" },
  bestBaitsContainer: { flex: 1 },
  historyContainer: { flex: 1 },
});
