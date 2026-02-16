import { ActivityIndicator, StyleSheet, View } from "react-native";
import useSpeciesList from "../hooks/useSpeciesList";
import SpeciesCard from "./SpeciesCard";
import SearchableList from "../../../common/components/SearchableList";
import { useMemo } from "react";

export default function SpeciesList() {
  const { isLoading, speciesList, favoriteSpeciesList, toggleFavorite } =
    useSpeciesList();

  const combinedSpeciesList = useMemo(() => {
    return [...favoriteSpeciesList, ...speciesList];
  }, [favoriteSpeciesList, speciesList]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <SearchableList
        list={combinedSpeciesList}
        placeholderText="Search Species..."
        renderItem={(species) => (
          <SpeciesCard
            species={species.item}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  listContainer: {
    flex: 1,
  },
});
