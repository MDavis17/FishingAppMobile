import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge, IconButton, useTheme } from "react-native-paper";
import {
  DEFAULT_FILTERS,
  TripListFilters,
} from "../hooks/useTripList";
import TripFilterDialog from "./TripFilterDialog";

interface Props {
  filters: TripListFilters;
  onReplaceFilters: (filters: TripListFilters) => void;
}

function countActiveFilterGroups(filters: TripListFilters): number {
  let count = 0;
  if (filters.status !== DEFAULT_FILTERS.status) {
    count += 1;
  }
  if (filters.dateSort !== DEFAULT_FILTERS.dateSort) {
    count += 1;
  }
  if (filters.tripTypes.length > 0) {
    count += 1;
  }
  return count;
}

export default function TripListFilterBar({
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
    <View
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.toolbar}>
        <View style={styles.filterButtonWrap}>
          <IconButton
            icon="filter-variant"
            accessibilityLabel="Filter trips"
            onPress={() => setDialogVisible(true)}
          />
          {activeFilterCount > 0 ? (
            <Badge size={18} style={styles.badge}>
              {activeFilterCount}
            </Badge>
          ) : null}
        </View>
      </View>
      <TripFilterDialog
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
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 0,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
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
