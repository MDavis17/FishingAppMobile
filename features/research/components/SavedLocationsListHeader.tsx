import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge, IconButton, TextInput, useTheme } from "react-native-paper";
import {
  DEFAULT_SAVED_LOCATION_FILTERS,
  SavedLocationListFilters,
} from "features/tripPlanner/hooks/useSavedLocationList";
import SavedLocationsFilterDialog from "./SavedLocationsFilterDialog";

interface Props {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filters: SavedLocationListFilters;
  onReplaceFilters: (filters: SavedLocationListFilters) => void;
}

function countActiveFilterGroups(filters: SavedLocationListFilters): number {
  let count = 0;
  if (filters.dateSort !== DEFAULT_SAVED_LOCATION_FILTERS.dateSort) {
    count += 1;
  }
  if (filters.catchStatus !== DEFAULT_SAVED_LOCATION_FILTERS.catchStatus) {
    count += 1;
  }
  if (filters.tripTypes.length > 0) {
    count += 1;
  }
  return count;
}

export default function SavedLocationsListHeader({
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
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          style={styles.searchInput}
          outlineStyle={styles.searchOutline}
        />
        <View style={styles.filterButtonWrap}>
          <IconButton
            icon="filter-variant"
            accessibilityLabel="Filter locations"
            onPress={() => setDialogVisible(true)}
          />
          {activeFilterCount > 0 ? (
            <Badge size={18} style={styles.badge}>
              {activeFilterCount}
            </Badge>
          ) : null}
        </View>
      </View>
      <SavedLocationsFilterDialog
        visible={dialogVisible}
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