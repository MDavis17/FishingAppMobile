import { Image, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Species, WaterType } from "types";
import Card from "common/components/Card";
import Divider from "common/components/Divider";
import { speciesImageUri } from "../utils/imageUtils";
import {
  FAVORITE_GOLD,
  FRESHWATER_COLOR,
  SALTWATER_COLOR,
} from "common/theme/themes";

interface Props {
  species: Species;
  onToggleFavorite?: (speciesId: number) => void;
}

export default function SpeciesCard({ species, onToggleFavorite }: Props) {
  const theme = useTheme();
  const isSaltwater = species.waterType === WaterType.Saltwater;
  const imageUri = speciesImageUri(species.image);
  const isFavorite = species.isFavorite === true;

  return (
    <View style={styles.outerPadding}>
      <Card>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{species.name}</Text>
              {onToggleFavorite ? (
                <IconButton
                  icon={isFavorite ? "star" : "star-outline"}
                  iconColor={isFavorite ? FAVORITE_GOLD : theme.colors.outline}
                  size={22}
                  onPress={() => onToggleFavorite(species.id)}
                />
              ) : null}
            </View>
            <View
              style={[
                styles.waterTypeTag,
                {
                  backgroundColor: isSaltwater
                    ? SALTWATER_COLOR
                    : FRESHWATER_COLOR,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.colors.onPrimary }]}>
                {species.waterType}
              </Text>
            </View>
          </View>

          <Divider />
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  outerPadding: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  contentContainer: {
    padding: 12,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
});
