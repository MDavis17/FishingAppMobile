import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  SegmentedButtons,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import {
  DEFAULT_SPECIES_FILTERS,
  SpeciesListFilters,
} from "../hooks/useFilteredSpeciesList";

interface Props {
  visible: boolean;
  kingdom: "animal" | "plant";
  filters: SpeciesListFilters;
  onDismiss: () => void;
  onApply: (filters: SpeciesListFilters) => void;
}

export default function SpeciesFilterDialog({
  visible,
  kingdom,
  filters,
  onDismiss,
  onApply,
}: Props) {
  const theme = useTheme();
  const [draft, setDraft] = useState<SpeciesListFilters>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const handleReset = () => {
    setDraft({ ...DEFAULT_SPECIES_FILTERS });
  };

  const handleApply = () => {
    onApply(draft);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Filter species</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {kingdom === "animal" ? (
              <>
                <Text variant="titleMedium" style={styles.sectionLabel}>
                  Catch status
                </Text>
                <SegmentedButtons
                  value={draft.caughtStatus}
                  onValueChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      caughtStatus: value as SpeciesListFilters["caughtStatus"],
                    }))
                  }
                  buttons={[
                    { value: "All", label: "All" },
                    { value: "Caught", label: "Caught" },
                    { value: "Uncaught", label: "Not yet" },
                  ]}
                  theme={{
                    colors: {
                      secondaryContainer: theme.colors.secondary,
                      onSecondaryContainer: theme.colors.onSecondary,
                    },
                  }}
                  style={styles.segmentedButtons}
                />
              </>
            ) : null}

            <Text variant="titleMedium" style={styles.sectionLabel}>
              Favorites
            </Text>
            <View style={styles.switchRow} collapsable={false}>
              <Text variant="bodyLarge">Favorites only</Text>
              <Switch
                key={draft.favoritesOnly ? "favorites-on" : "favorites-off"}
                value={draft.favoritesOnly}
                onValueChange={(favoritesOnly) =>
                  setDraft((prev) => ({ ...prev, favoritesOnly }))
                }
              />
            </View>

            <Text variant="titleMedium" style={styles.sectionLabel}>
              Sort by name
            </Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  nameSort: value as SpeciesListFilters["nameSort"],
                }))
              }
              value={draft.nameSort}
            >
              <RadioButton.Item label="A–Z" value="name_asc" />
              <RadioButton.Item label="Z–A" value="name_desc" />
            </RadioButton.Group>
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
  segmentedButtons: {
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 4,
  },
});