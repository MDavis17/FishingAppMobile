import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge, IconButton, TextInput, useTheme } from "react-native-paper";
import {
  DEFAULT_SPECIES_FILTERS,
  SpeciesListFilters,
} from "../hooks/useFilteredSpeciesList";
import SpeciesFilterDialog from "./SpeciesFilterDialog";

interface Props {
  kingdom: "animal" | "plant";
  placeholderText: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filters: SpeciesListFilters;
  onReplaceFilters: (filters: SpeciesListFilters) => void;
}

function countActiveFilterGroups(filters: SpeciesListFilters): number {
  let count = 0;
  if (filters.caughtStatus !== DEFAULT_SPECIES_FILTERS.caughtStatus) {
    count += 1;
  }
  if (filters.favoritesOnly !== DEFAULT_SPECIES_FILTERS.favoritesOnly) {
    count += 1;
  }
  if (filters.nameSort !== DEFAULT_SPECIES_FILTERS.nameSort) {
    count += 1;
  }
  if (filters.speciesGroups.length > 0) {
    count += 1;
  }
  return count;
}

export default function SpeciesListHeader({
  kingdom,
  placeholderText,
  searchQuery,
  onSearchQueryChange,
  filters,
  onReplaceFilters,
}: Props) {
  const theme = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const activeFilterCount = useMemo(
    () => countActiveFilterGroups(filters),
    [filters],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.toolbar}>
        <TextInput
          mode="outlined"
          dense
          placeholder={placeholderText}
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          style={styles.searchInput}
          outlineStyle={styles.searchOutline}
        />
        <View style={styles.filterButtonWrap}>
          <IconButton
            icon="filter-variant"
            accessibilityLabel="Filter species"
            onPress={() => setDialogVisible(true)}
          />
          {activeFilterCount > 0 ? (
            <Badge size={18} style={styles.badge}>
              {activeFilterCount}
            </Badge>
          ) : null}
        </View>
      </View>
      <SpeciesFilterDialog
        visible={dialogVisible}
        kingdom={kingdom}
        filters={filters}
        onDismiss={() => setDialogVisible(false)}
        onApply={onReplaceFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  searchInput: {
    flex: 1,
    marginVertical: 0,
    height: 40,
  },
  searchOutline: {
    borderRadius: 5,
  },
  filterButtonWrap: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
  },
});
