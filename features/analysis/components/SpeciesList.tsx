import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Species } from "types";
import useSpeciesList from "../hooks/useSpeciesList";

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
      <ScrollView style={styles.flex1}>
        {speciesList.map((fish: Species) => {
          return <Text>{fish.name}</Text>
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  flex1: {
    flex: 1
  },
});
