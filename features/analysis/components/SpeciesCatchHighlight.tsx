import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "common/components/Card";
import {
  formatCatchDate,
  formatCatchLength,
} from "features/analysis/utils/catchHistoryUtils";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Species, SpeciesCatchHistoryItem } from "types";

interface Props {
  species: Species;
  title: string;
  titleIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  catchItem: SpeciesCatchHistoryItem | null;
}

export default function SpeciesCatchHighlight({
  species,
  title,
  titleIcon,
  catchItem,
}: Props) {
  const theme = useTheme();
  const lengthUnit = species.lengthUnits ?? "in";
  const imageUri = speciesImageUri(species.image);

  return (
    <Card style={[styles.card, styles.shadow]}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons
          name={titleIcon}
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          variant="labelLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {title}
        </Text>
      </View>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text variant="titleMedium" style={styles.length}>
        {catchItem ? formatCatchLength(catchItem.length, lengthUnit) : "—"}
      </Text>
      <Text variant="bodySmall" style={styles.date}>
        {catchItem ? formatCatchDate(catchItem.dateTime) : "—"}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: 72,
    marginVertical: 4,
  },
  imagePlaceholder: {
    width: "100%",
    height: 72,
    marginVertical: 4,
  },
  length: {
    fontWeight: "700",
    marginTop: 4,
  },
  date: {
    opacity: 0.6,
    marginTop: 2,
    textAlign: "center",
  },
});
