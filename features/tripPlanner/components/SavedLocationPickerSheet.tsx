import PrimaryButton from "common/components/buttons/PrimaryButton";
import useSavedLocationList, {
  DEFAULT_SAVED_LOCATION_FILTERS,
} from "features/tripPlanner/hooks/useSavedLocationList";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { LatLng } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SavedLocation } from "types";
import SavedLocationPickerListItem from "./SavedLocationPickerListItem";

const SEARCH_DEBOUNCE_MS = 300;

function coordinatesMatch(a: LatLng, b: LatLng): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < 1e-5 &&
    Math.abs(a.longitude - b.longitude) < 1e-5
  );
}

interface Props {
  visible: boolean;
  currentCoordinates: LatLng;
  onDismiss: () => void;
  onConfirm: (saved: SavedLocation) => void;
}

export default function SavedLocationPickerSheet({
  visible,
  currentCoordinates,
  onDismiss,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const didSetInitialSelection = useRef(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const { isInitialLoading, locations, hasLocations, hasFilteredLocations } =
    useSavedLocationList({
      search: debouncedSearch,
      filters: DEFAULT_SAVED_LOCATION_FILTERS,
    });

  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setDebouncedSearch("");
      setSelectedId(null);
      didSetInitialSelection.current = false;
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || isInitialLoading || didSetInitialSelection.current) {
      return;
    }

    const match = locations.find((loc) =>
      coordinatesMatch(loc.location.coordinates, currentCoordinates),
    );
    setSelectedId(match?.id ?? null);
    didSetInitialSelection.current = true;
  }, [visible, isInitialLoading, locations, currentCoordinates]);

  const handleDismiss = () => {
    Keyboard.dismiss();
    onDismiss();
  };

  const handleUseLocation = () => {
    const saved = locations.find((loc) => loc.id === selectedId);
    if (!saved) {
      return;
    }
    Keyboard.dismiss();
    onConfirm(saved);
    onDismiss();
  };

  const renderEmpty = () => {
    if (isInitialLoading) {
      return null;
    }
    const message = !hasLocations
      ? "No saved locations yet. Save a spot from a trip to see it here."
      : "No locations match your search.";

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          {message}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleDismiss} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.background,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View
            style={[styles.handle, { backgroundColor: theme.colors.outline }]}
          />
          <View style={styles.headerRow}>
            <IconButton
              icon="close"
              onPress={handleDismiss}
              accessibilityLabel="Close"
            />
            <Text variant="titleMedium" style={styles.headerTitle}>
              Select Saved Location
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.searchWrap}>
            <TextInput
              mode="outlined"
              dense
              placeholder="Search saved locations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              outlineStyle={styles.searchOutline}
              left={<TextInput.Icon icon="magnify" />}
            />
          </View>

          {isInitialLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <FlatList
              data={locations}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <SavedLocationPickerListItem
                  savedLocation={item}
                  selected={item.id === selectedId}
                  onPress={() => setSelectedId(item.id)}
                />
              )}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.listContent,
                !hasFilteredLocations && styles.listContentEmpty,
              ]}
              ListEmptyComponent={renderEmpty}
            />
          )}

          <View style={styles.footer}>
            <PrimaryButton
              onPress={handleUseLocation}
              disabled={selectedId == null}
            >
              Use This Location
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    maxHeight: "78%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  headerSpacer: {
    width: 48,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    marginVertical: 0,
    height: 44,
    backgroundColor: "white",
  },
  searchOutline: {
    borderRadius: 8,
  },
  loader: {
    marginVertical: 24,
  },
  listContent: {
    paddingBottom: 8,
    gap: 8,
  },
  listContentEmpty: {
    flexGrow: 1,
    minHeight: 120,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});