import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { toggleSpeciesFavorite } from "features/analysis/api/toggleSpeciesFavorite";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import SpeciesHeader from "./SpeciesHeader";

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
      <SpeciesHeader species={species} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
});
