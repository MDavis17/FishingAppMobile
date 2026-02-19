import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import Fuse from "fuse.js";

const MAX_DROPDOWN_HEIGHT = 220;
const BLUR_CLOSE_DELAY_MS = 100;

export interface SearchableDropdownInputProps<T> {
  options: T[];
  value: T | null;
  onSelect: (item: T | null) => void;
  getOptionLabel: (item: T) => string;
  placeholder?: string;
  getOptionKey?: (item: T) => string | number;
  fuzzy?: boolean;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  maxDropdownHeight?: number;
}

export default function SearchableDropdownInput<T>({
  options,
  value,
  onSelect,
  getOptionLabel,
  placeholder = "Search...",
  getOptionKey,
  fuzzy = false,
  label,
  disabled = false,
  error = false,
  maxDropdownHeight = MAX_DROPDOWN_HEIGHT,
}: SearchableDropdownInputProps<T>) {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayValue = value ? getOptionLabel(value) : "";
  const inputValue = dropdownOpen ? query : displayValue;

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;

    if (fuzzy) {
      const fuse = new Fuse(options, {
        keys: [{ name: "label", getFn: (item: T) => getOptionLabel(item) }],
        threshold: 0.3,
      });
      return fuse.search(query).map((r) => r.item);
    }

    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(q),
    );
  }, [options, query, fuzzy, getOptionLabel]);

  const keyExtractor = (item: T, index: number): string => {
    if (getOptionKey) return String(getOptionKey(item));
    const label = getOptionLabel(item);
    return `${label}-${index}`;
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setDropdownOpen(true);
    setQuery(displayValue);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
      setQuery("");
      blurTimeoutRef.current = null;
    }, BLUR_CLOSE_DELAY_MS);
  };

  const handleSelect = (item: T) => {
    Keyboard.dismiss();
    onSelect(item);
    setDropdownOpen(false);
    setQuery("");
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (!dropdownOpen) setDropdownOpen(true);
  };

  const dropdownStyles = {
    borderColor: theme.colors.outline,
    backgroundColor: theme.colors.background,
    maxHeight: maxDropdownHeight,
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        mode="outlined"
        label={label}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        style={[styles.input, { backgroundColor: theme.colors.background }]}
        right={
          value && !dropdownOpen ? (
            <TextInput.Icon
              icon="close"
              onPress={() => {
                onSelect(null);
                setQuery("");
              }}
            />
          ) : null
        }
      />

      {dropdownOpen && (
        <View
          style={[
            styles.dropdown,
            {
              borderColor: dropdownStyles.borderColor,
              backgroundColor: dropdownStyles.backgroundColor,
              maxHeight: dropdownStyles.maxHeight,
            },
          ]}
        >
          {filteredOptions.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                No results
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={keyExtractor}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    { backgroundColor: theme.colors.background },
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text variant="bodyLarge">{getOptionLabel(item)}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1000,
  },
  input: {
    marginVertical: 0,
  },
  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
});
