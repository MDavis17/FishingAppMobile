import React from "react";
import { StyleSheet, View } from "react-native";
import DropdownSelect from "common/components/DropdownSelect";
import { TripListFilters } from "../hooks/useTripList";

interface Props {
  filters: TripListFilters;
  onFiltersChange: (updates: Partial<TripListFilters>) => void;
}

const STATUS_OPTIONS = [
  { value: "All" as const, label: "All" },
  { value: "Planned" as const, label: "Planned" },
  { value: "Completed" as const, label: "Completed" },
];

const DATE_SORT_OPTIONS = [
  { value: "newest" as const, label: "Newest first" },
  { value: "oldest" as const, label: "Oldest first" },
];

export default function TripListFilterBar({ filters, onFiltersChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <DropdownSelect
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(status) => onFiltersChange({ status })}
        />
        <DropdownSelect
          label="Sort by date"
          value={filters.dateSort}
          options={DATE_SORT_OPTIONS}
          onChange={(dateSort) => onFiltersChange({ dateSort })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
});
