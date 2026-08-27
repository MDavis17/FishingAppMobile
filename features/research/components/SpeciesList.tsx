import useSpeciesList from "features/analysis/hooks/useSpeciesList";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import SearchableList from "common/components/SearchableList";
import SpeciesListItem from "./SpeciesListItem";

export default function SpeciesList() {
  const theme = useTheme();
  const { isLoading, speciesList, favoriteSpeciesList } =
    useSpeciesList("animal");

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
          placeholderText="Search Species..."
          renderItem={({ item }) => <SpeciesListItem species={item} />}
        />
      )}
    </View>
  );
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
