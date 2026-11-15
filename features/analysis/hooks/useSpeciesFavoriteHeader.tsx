import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { toggleSpeciesFavorite } from "features/analysis/api/toggleSpeciesFavorite";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { RootStackParamList, Species } from "types";

type SpeciesScreen = "SpeciesDetail" | "SpeciesCatchHistory";

function syncSpeciesDetailFavorite(
  navigation: NavigationProp<RootStackParamList>,
  species: Species,
  isFavorite: boolean,
) {
  const state = navigation.getState();
  const detail = state.routes.find(
    (r) => r.name === "SpeciesDetail",
  ) as { key: string } | undefined;
  if (!detail?.key) {
    return;
  }

  navigation.dispatch({
    ...CommonActions.setParams({
      species: { ...species, isFavorite },
    }),
    source: detail.key,
  });
}

export default function useSpeciesFavoriteHeader(
  screen: SpeciesScreen,
  species: Species,
) {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [isFavorite, setIsFavorite] = useState(species.isFavorite);
  const isTogglingRef = useRef(false);

  useEffect(() => {
    setIsFavorite(species.isFavorite);
  }, [species.isFavorite, species.id]);

  const handleToggleFavorite = useCallback(async () => {
    if (isTogglingRef.current) {
      return;
    }

    isTogglingRef.current = true;
    const previousValue = isFavorite;
    const nextValue = !previousValue;

    setIsFavorite(nextValue);

    try {
      const response = await toggleSpeciesFavorite(species.id);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const updatedSpecies = { ...species, isFavorite: nextValue };

      if (screen === "SpeciesDetail") {
        navigation.setParams({ species: updatedSpecies } as never);
      } else {
        navigation.setParams({ species: updatedSpecies } as never);
        syncSpeciesDetailFavorite(navigation, species, nextValue);
      }
    } catch (error) {
      console.error("Error toggling species favorite:", error);
      setIsFavorite(previousValue);
    } finally {
      isTogglingRef.current = false;
    }
  }, [isFavorite, navigation, screen, species]);

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
  }, [
    handleToggleFavorite,
    isFavorite,
    navigation,
    route.name,
    theme.colors.secondary,
  ]);
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
});