import useSpeciesList from "features/analysis/hooks/useSpeciesList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SearchableList from "common/components/SearchableList";
import { RootStackParamList, Species } from "types";
import SpeciesListItem from "./SpeciesListItem";

type SpeciesListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SpeciesList"
>;

interface Props {
  kingdom: "animal" | "plant";
  placeholderText: string;
}

export default function SpeciesList({ kingdom, placeholderText }: Props) {
  const navigation = useNavigation<SpeciesListNavigationProp>();
  const { isLoading, speciesList, favoriteSpeciesList } =
    useSpeciesList(kingdom);

  const combinedSpeciesList = useMemo(() => {
    return [...favoriteSpeciesList, ...speciesList];
  }, [favoriteSpeciesList, speciesList]);

  const handleSpeciesPress = useCallback(
    (species: Species) => {
      navigation.navigate("SpeciesDetail", { species });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <SearchableList
          list={combinedSpeciesList}
          placeholderText={placeholderText}
          renderItem={({ item }) => (
            <SpeciesListItem
              species={item}
              onPress={
                kingdom === "animal"
                  ? () => handleSpeciesPress(item)
                  : undefined
              }
            />
          )}
        />
      )}
    </View>
  );
}

export function AnimalSpeciesListScreen() {
  return <SpeciesList kingdom="animal" placeholderText="Search Species..." />;
}

export function PlantSpeciesListScreen() {
  return <SpeciesList kingdom="plant" placeholderText="Search Plants..." />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loader: {
    marginTop: 24,
  },
});
