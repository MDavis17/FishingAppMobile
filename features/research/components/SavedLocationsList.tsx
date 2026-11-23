import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import useSavedLocationList, {
  DEFAULT_SAVED_LOCATION_FILTERS,
  SavedLocationListFilters,
} from "features/tripPlanner/hooks/useSavedLocationList";
import SavedLocationListItem from "./SavedLocationListItem";
import SavedLocationsListHeader from "./SavedLocationsListHeader";

const SEARCH_DEBOUNCE_MS = 300;

export default function SavedLocationsListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<SavedLocationListFilters>(
    DEFAULT_SAVED_LOCATION_FILTERS,
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const {
    isInitialLoading,
    isRefreshing,
    locations,
    hasLocations,
    hasFilteredLocations,
    refreshLocations,
    removeLocationLocally,
    restoreLocationLocally,
  } = useSavedLocationList({
    search: debouncedSearch,
    filters,
  });

  const renderEmpty = () => {
    if (isInitialLoading) {
      return null;
    }
    const message = !hasLocations
      ? "No saved locations yet. Save a spot from a trip to see it here."
      : "No locations match your search or filters.";

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          {message}
        </Text>
      </View>
    );
  };

  return (
    <>
      <SavedLocationsListHeader
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
            data={locations}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <SavedLocationListItem
                savedLocation={item}
                onDeleted={removeLocationLocally}
                onDeleteFailed={restoreLocationLocally}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshLocations}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              !hasFilteredLocations && styles.listContentEmpty,
            ]}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>
    </>
  );
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
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.8,
  },
});