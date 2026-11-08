import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  Dialog,
  Portal,
  RadioButton,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import { TripType } from "types";
import {
  DEFAULT_FILTERS,
  TripListFilters,
} from "../hooks/useTripList";

const TRIP_TYPES = Object.values(TripType) as TripType[];

interface Props {
  visible: boolean;
  filters: TripListFilters;
  onDismiss: () => void;
  onApply: (filters: TripListFilters) => void;
}

export default function TripFilterDialog({
  visible,
  filters,
  onDismiss,
  onApply,
}: Props) {
  const theme = useTheme();
  const [draft, setDraft] = useState<TripListFilters>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const handleReset = () => {
    setDraft({ ...DEFAULT_FILTERS });
  };

  const handleApply = () => {
    onApply(draft);
    onDismiss();
  };

  const toggleTripType = (tripType: TripType) => {
    setDraft((prev) => {
      const isSelected = prev.tripTypes.includes(tripType);
      const tripTypes = isSelected
        ? prev.tripTypes.filter((type) => type !== tripType)
        : [...prev.tripTypes, tripType];
      return { ...prev, tripTypes };
    });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Filter trips</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text variant="titleMedium" style={styles.sectionLabel}>
              Status
            </Text>
            <SegmentedButtons
              value={draft.status}
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  status: value as TripListFilters["status"],
                }))
              }
              buttons={[
                { value: "All", label: "All" },
                { value: "Planned", label: "Planned" },
                { value: "Completed", label: "Completed" },
              ]}
              theme={{
                colors: {
                  secondaryContainer: theme.colors.secondary,
                  onSecondaryContainer: theme.colors.onSecondary,
                },
              }}
              style={styles.segmentedButtons}
            />

            <Text variant="titleMedium" style={styles.sectionLabel}>
              Sort by date
            </Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  dateSort: value as TripListFilters["dateSort"],
                }))
              }
              value={draft.dateSort}
            >
              <RadioButton.Item label="Newest first" value="newest" />
              <RadioButton.Item label="Oldest first" value="oldest" />
            </RadioButton.Group>

            <Text variant="titleMedium" style={styles.sectionLabel}>
              Trip type
            </Text>
            <Text variant="bodySmall" style={styles.hint}>
              Leave unselected to show all types.
            </Text>
            <View style={styles.chipRow}>
              {TRIP_TYPES.map((tripType) => {
                const selected = draft.tripTypes.includes(tripType);
                return (
                  <Chip
                    key={tripType}
                    selected={selected}
                    showSelectedCheck
                    onPress={() => toggleTripType(tripType)}
                    style={styles.chip}
                    compact
                  >
                    {tripType}
                  </Chip>
                );
              })}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleReset}>Reset</Button>
          <Button onPress={handleApply}>Apply</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 420,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
  },
  hint: {
    marginBottom: 8,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    marginVertical: 0,
  },
});
