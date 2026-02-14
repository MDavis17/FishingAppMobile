import { FlatList, ListRenderItem, TextInput, View } from "react-native";
import { useMemo, useState } from "react";
import { useTheme } from "react-native-paper";

interface Props {
  list: any[];
  placeholderText?: string;
  renderItem: ListRenderItem<any>;
}

export default function SearchableList({
  list,
  placeholderText = "Search...",
  renderItem,
}: Props) {
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const filteredSpecies = useMemo(() => {
    if (!query) return list;

    return list.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, list]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder={placeholderText}
        value={query}
        onChangeText={setQuery}
        style={{
          padding: 12,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          backgroundColor: theme.colors.background,
          borderRadius: 5,
        }}
      />

      <FlatList
        data={filteredSpecies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
