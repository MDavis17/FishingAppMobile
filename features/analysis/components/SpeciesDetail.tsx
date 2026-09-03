import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { toggleSpeciesFavorite } from "features/analysis/api/toggleSpeciesFavorite";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { RootStackParamList } from "types";

type SpeciesAnalysisRouteProp = RouteProp<RootStackParamList, "SpeciesDetail">;

export default function SpeciesDetail() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<SpeciesAnalysisRouteProp>();
  const { species } = route.params;

  const [isFavorite, setIsFavorite] = useState(species.isFavorite);
  const isTogglingRef = useRef(false);

  const handleToggleFavorite = useCallback(async () => {
    if (isTogglingRef.current) {
      return;
    }

    isTogglingRef.current = true;
    const previousValue = isFavorite;

    setIsFavorite((prev) => !prev);

    try {
      const response = await toggleSpeciesFavorite(species.id);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      navigation.setParams({
        species: { ...species, isFavorite: !previousValue },
      });
    } catch (error) {
      console.error("Error toggling species favorite:", error);
      setIsFavorite(previousValue);
    } finally {
      isTogglingRef.current = false;
    }
  }, [isFavorite, navigation, species]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <MaterialCommunityIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={theme.colors.secondary}
          />
        </Pressable>
      ),
    });
  }, [handleToggleFavorite, isFavorite, navigation, theme.colors.onSurface]);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.speciesName}>
          {species.name}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  waterTypeTag: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  speciesName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  identificationContainer: { flex: 1, paddingVertical: 6 },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  speciesImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetsContainer: { flex: 1 },
  sectionTitle: { marginBottom: 8, fontWeight: "bold" },
  bestBaitsContainer: { flex: 1 },
  historyContainer: { flex: 1 },
});
