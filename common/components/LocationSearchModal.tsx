import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, TextInput } from "react-native-paper";
import { getPlaceSuggestions } from "common/api/getPlaceSuggestions";
import { getPlaceDetails } from "common/api/getPlaceDetails";
import { useLocation } from "common/context/LocationContext";

interface Prediction {
  place_id: string;
  description: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LocationSearchModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setLocation } = useLocation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!visible) {
      setQuery("");
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const debounce = setTimeout(async () => {
      try {
        const response = await getPlaceSuggestions(encodeURIComponent(query));
        if (!cancelled && response.ok) {
          setResults(response.data.predictions ?? []);
        }
      } catch (err) {
        console.error("LocationSearchModal: failed to fetch suggestions", err);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      cancelled = true;
    };
  }, [query]);

  const handleSelect = async (item: Prediction) => {
    try {
      const response = await getPlaceDetails(item.place_id);
      if (!response.ok) return;

      const coords = response.data.result?.geometry?.location;
      if (coords) {
        setLocation({
          name: item.description,
          coordinates: { latitude: coords.lat, longitude: coords.lng },
        });
        Keyboard.dismiss();
        onClose();
      }
    } catch (err) {
      console.error("LocationSearchModal: failed to fetch place details", err);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.primary,
              paddingTop: insets.top + 8,
            },
          ]}
        >
          <TextInput
            mode="outlined"
            placeholder="Search for a location..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            outlineColor="transparent"
            activeOutlineColor="transparent"
            left={<TextInput.Icon icon="magnify" color={theme.colors.onSurface} />}
            right={
              query.length > 0 ? (
                <TextInput.Icon
                  icon="close-circle"
                  color={theme.colors.onSurface}
                  onPress={() => setQuery("")}
                />
              ) : undefined
            }
            style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
            contentStyle={styles.searchInputContent}
          />
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={{ color: theme.colors.onPrimary }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            query.length >= 2 && !isSearching ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="map-search-outline"
                  size={40}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  No locations found
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={20}
                color={theme.colors.primary}
                style={styles.resultIcon}
              />
              <Text
                variant="bodyMedium"
                style={[styles.resultText, { color: theme.colors.onSurface }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  searchInputContent: {
    fontSize: 15,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingLeft: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultText: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
});
