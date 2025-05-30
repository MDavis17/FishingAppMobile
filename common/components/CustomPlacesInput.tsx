import React from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import useCustomPlacesInput from "common/hooks/useCustomPlacesInput";
import { LatLng } from "react-native-maps";

interface Props {
  onLocationSelect: (location: LatLng) => void;
}

export default function CustomPlacesInput({ onLocationSelect }: Props) {
  const { inputRef, query, setQuery, showResults, results, handleSelect } =
    useCustomPlacesInput(onLocationSelect);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        placeholder="Search for a place"
        value={query}
        onChangeText={(text) => setQuery(text)}
        style={styles.input}
      />

      {showResults && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 5,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  dropdown: {
    maxHeight: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "white",
    borderTopWidth: 0,
  },
  item: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
