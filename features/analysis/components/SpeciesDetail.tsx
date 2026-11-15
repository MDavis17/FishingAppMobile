import { RouteProp, useRoute } from "@react-navigation/native";
import useSpeciesFavoriteHeader from "features/analysis/hooks/useSpeciesFavoriteHeader";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import SpeciesCatchHistoryCard from "./SpeciesCatchHistoryCard";
import SpeciesHeader from "./SpeciesHeader";
import SpeciesPhotosCard from "./SpeciesPhotosCard";

type SpeciesAnalysisRouteProp = RouteProp<RootStackParamList, "SpeciesDetail">;

export default function SpeciesDetail() {
  const theme = useTheme();
  const route = useRoute<SpeciesAnalysisRouteProp>();
  const species = route.params.species;

  useSpeciesFavoriteHeader("SpeciesDetail", species);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <SpeciesHeader species={species} />
      <SpeciesPhotosCard species={species} />
      <SpeciesCatchHistoryCard species={species} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 8,
  },
});