import { MaterialCommunityIcons } from "@expo/vector-icons";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FAVORITE_GOLD } from "common/theme/themes";
import { Species } from "types";

interface Props {
  species: Species;
  onPress?: () => void;
}

export default function SpeciesListItem({ species, onPress }: Props) {
  const theme = useTheme();
  const imageUri = speciesImageUri(species.image);

  const content = (
    <>
      <View style={styles.thumbnailContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        ) : (
          <View
            style={[
              styles.thumbnailPlaceholder,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          />
        )}
      </View>
      <Text
        style={[styles.name, { color: theme.colors.onSurface }]}
        numberOfLines={2}
      >
        {species.name}
      </Text>
      <View style={styles.favoriteContainer}>
        {species.isFavorite ? (
          <MaterialCommunityIcons
            name="heart"
            size={20}
            color={FAVORITE_GOLD}
          />
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 12,
  },
  thumbnailContainer: {
    width: 130,
    height: 70,
    borderRadius: 6,
    overflow: "hidden",
  },
  thumbnail: {
    width: 130,
    height: 70,
    resizeMode: "cover",
  },
  thumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  favoriteContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
