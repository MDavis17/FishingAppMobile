import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Species } from "types";
import useSpeciesList from "../hooks/useSpeciesList";
import SpeciesCard from "./SpeciesCard";

export default function SpeciesList() {
  const { isLoading, speciesList} = useSpeciesList();

  if (isLoading) {
    return (
      <ActivityIndicator />
    );
  }

  return (
    <View
      style={styles.container}
    >
      <ScrollView style={styles.listContainer}>
        {speciesList.map((fish: Species) => {
          return <SpeciesCard species={fish} key={`species-item-${fish.id}`}/>
        })}
      </ScrollView>
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
