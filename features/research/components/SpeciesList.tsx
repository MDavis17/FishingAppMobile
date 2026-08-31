import useSpeciesList from "features/analysis/hooks/useSpeciesList";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SearchableList from "common/components/SearchableList";
import SpeciesListItem from "./SpeciesListItem";

interface Props {
  kingdom: "animal" | "plant";
  placeholderText: string;
}

export default function SpeciesList({ kingdom, placeholderText }: Props) {
  const { isLoading, speciesList, favoriteSpeciesList } =
    useSpeciesList(kingdom);

  const combinedSpeciesList = useMemo(() => {
    return [...favoriteSpeciesList, ...speciesList];
  }, [favoriteSpeciesList, speciesList]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <SearchableList
          list={combinedSpeciesList}
          placeholderText={placeholderText}
          renderItem={({ item }) => <SpeciesListItem species={item} />}
        />
      )}
    </View>
  );
}

export function AnimalSpeciesListScreen() {
  return <SpeciesList kingdom="animal" placeholderText="Search Species..." />;
}

export function PlantSpeciesListScreen() {
  return <SpeciesList kingdom="plant" placeholderText="Search Plants..." />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loader: {
    marginTop: 24,
  },
});
