import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { RootStackParamList, Species } from "types";
import useFilteredSpeciesList, {
  DEFAULT_SPECIES_FILTERS,
  SpeciesListFilters,
} from "../hooks/useFilteredSpeciesList";
import SpeciesListHeader from "./SpeciesListHeader";
import SpeciesListItem from "./SpeciesListItem";

type SpeciesListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SpeciesList"
>;

interface Props {
  kingdom: "animal" | "plant";
  placeholderText: string;
}

const SEARCH_DEBOUNCE_MS = 300;

export default function SpeciesList({ kingdom, placeholderText }: Props) {
  const navigation = useNavigation<SpeciesListNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<SpeciesListFilters>(
    DEFAULT_SPECIES_FILTERS,
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const { isInitialLoading, isRefreshing, speciesList, refreshSpecies } =
    useFilteredSpeciesList({
      kingdom,
      search: debouncedSearch,
      filters,
    });

  const handleSpeciesPress = useCallback(
    (species: Species) => {
      navigation.navigate("SpeciesDetail", { species });
    },
    [navigation],
  );

  return (
    <>
      <SpeciesListHeader
        kingdom={kingdom}
        placeholderText={placeholderText}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        filters={filters}
        onReplaceFilters={setFilters}
      />
      <View style={styles.container}>
        {isInitialLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <FlatList
            data={speciesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SpeciesListItem
                species={item}
                onPress={
                  kingdom === "animal"
                    ? () => handleSpeciesPress(item)
                    : undefined
                }
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshSpecies}
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </>
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
    paddingTop: 8,
  },
  loader: {
    marginTop: 24,
  },
  listContent: {
    paddingBottom: 16,
    gap: 8,
  },
});
