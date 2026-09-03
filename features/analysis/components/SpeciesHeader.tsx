import { MaterialCommunityIcons } from "@expo/vector-icons";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Species } from "types";

interface Props {
  species: Species;
}

interface StatItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string;
  unit?: string;
}

export default function SpeciesHeader({ species }: Props) {
  const theme = useTheme();
  const imageUri = speciesImageUri(species.image);

  const stats: StatItem[] = (
    [
      {
        icon: "ruler",
        label: "Avg Length",
        value: species.avgLength,
        unit: "in",
      },
      {
        icon: "clock-outline",
        label: "Lifespan",
        value: species.lifespan,
        unit: "years",
      },
      {
        icon: "gauge",
        label: "Depth Range",
        value: species.depthRange,
        unit: "ft",
      },
    ] satisfies StatItem[]
  ).filter((stat) => Boolean(stat.value));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <Text
            variant="headlineMedium"
            style={[styles.speciesName, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {species.name}
          </Text>
          {species.scientificName ? (
            <Text
              style={[styles.scientificName, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {species.scientificName}
            </Text>
          ) : null}
        </View>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>
      {stats.length > 0 ? (
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <MaterialCommunityIcons
                name={stat.icon}
                size={18}
                color={theme.colors.onSurface}
              />
              <View style={styles.statText}>
                <Text
                  style={[styles.statLabel, { color: theme.colors.onSurface }]}
                >
                  {stat.label}
                </Text>
                <Text
                  style={[styles.statValue, { color: theme.colors.onSurface }]}
                  numberOfLines={2}
                >
                  {stat.value}
                  {stat.unit ? ` ${stat.unit}` : ""}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  identity: {
    flex: 1,
    gap: 6,
  },
  speciesName: {
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 32,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.55,
  },
  imageContainer: {
    width: 125,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: 150,
    height: 110,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
    paddingTop: 8,
  },
  stat: {
    width: "33%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});
