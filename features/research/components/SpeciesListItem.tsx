import { MaterialCommunityIcons } from "@expo/vector-icons";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { Species } from "types";
import Card from "common/components/Card";

interface Props {
  species: Species;
  onPress?: () => void;
}

export default function SpeciesListItem({ species, onPress }: Props) {
  const theme = useTheme();
  const imageUri = speciesImageUri(species.image);

  const content = (
    <Card style={styles.card}>
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
      <View style={styles.textContainer}>
        <Text
          style={[styles.name, { color: theme.colors.onSurface }]}
          numberOfLines={2}
        >
          {species.name}
        </Text>
        {species.group ? (
          <Chip
            compact
            style={[
              styles.groupChip,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            textStyle={[
              styles.groupChipText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {species.group}
          </Chip>
        ) : null}
      </View>
      <View style={styles.favoriteContainer}>
        {species.isFavorite ? (
          <MaterialCommunityIcons
            name="heart"
            size={20}
            color={theme.colors.secondary}
          />
        ) : null}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={26}
        color={theme.colors.onSurface}
      />
    </Card>
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
  card: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 10,
    gap: 12,
  },
  container: {
    alignItems: "center",
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
  textContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  groupChip: {
    alignSelf: "flex-start",
  },
  groupChipText: {
    fontSize: 11,
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
