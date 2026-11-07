import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { Species } from "types";
import { getSpecies } from "features/analysis/api/getSpecies";

interface Props {
  selectedSpecies: Species[];
  onSelectedSpeciesChange: (species: Species[]) => void;
}

export default function SpeciesChipSelector({
  selectedSpecies,
  onSelectedSpeciesChange,
}: Props) {
  const theme = useTheme();
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const fetchSpecies = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getSpecies();

      if (!response.ok) {
        throw new Error("Failed to fetch species");
      }

      setSpeciesList(response.data.species);
    } catch (error) {
      console.error("Error fetching species:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  const selectedSpeciesIds = useMemo(
    () => new Set(selectedSpecies.map((species) => species.id)),
    [selectedSpecies],
  );

  const filteredSpecies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return speciesList.filter((species) => {
      if (selectedSpeciesIds.has(species.id)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return species.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query, selectedSpeciesIds, speciesList]);

  const showDropdown = isFocused && query.trim().length > 0;
  const borderColor = isFocused ? theme.colors.primary : theme.colors.outline;

  const handleSelectSpecies = (species: Species) => {
    onSelectedSpeciesChange([...selectedSpecies, species]);
    setQuery("");
  };

  const handleRemoveSpecies = (speciesId: number) => {
    onSelectedSpeciesChange(
      selectedSpecies.filter((species) => species.id !== speciesId),
    );
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>
        Target Species
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <RNTextInput
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={
            selectedSpecies.length === 0 ? "Search species..." : "Add more..."
          }
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={[
            styles.textInput,
            {
              color: theme.colors.onSurface,
            },
          ]}
        />

        {selectedSpecies.length > 0 && (
          <View style={styles.chipContainer}>
            {selectedSpecies.map((species) => (
              <Chip
                key={species.id}
                compact
                onClose={() => handleRemoveSpecies(species.id)}
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primary },
                ]}
                textStyle={{ color: theme.colors.onPrimary }}
                theme={{
                  colors: {
                    onSurfaceVariant: theme.colors.onPrimary,
                  },
                }}
                closeIconAccessibilityLabel={`Remove ${species.name}`}
              >
                {species.name}
              </Chip>
            ))}
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        showDropdown && (
          <View
            style={[
              styles.dropdown,
              {
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            <FlatList
              data={filteredSpecies.slice(0, 8)}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              ListEmptyComponent={
                <Text style={styles.emptyText}>No matching species found</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectSpecies(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    marginVertical: 2,
  },
  textInput: {
    width: "100%",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minHeight: 32,
  },
  loader: {
    marginTop: 8,
  },
  dropdown: {
    maxHeight: 180,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  emptyText: {
    padding: 12,
    color: "#666",
  },
});
