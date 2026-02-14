import { config } from "common/api/config";
import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Species, WaterType } from "types";
import Card from "common/components/Card";

const SALTWATER = "#1E5EFF";
const FRESHWATER = "#2E8B57";

/** Resolves species image to an absolute URI using app's API base so it works on emulator/device (e.g. 10.0.2.2:8000 on Android). */
function speciesImageUri(image: string): string {
  if (!image) return "";
  const base = config.api.replace(/\/$/, "");
  let path: string;
  try {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      path = new URL(image).pathname;
    } else {
      path = image.startsWith("/") ? image : `/${image}`;
    }
  } catch {
    path = image.startsWith("/") ? image : `/${image}`;
  }
  return `${base}${path}`;
}

interface Props {
  species: Species;
}

export default function SpeciesCard({ species }: Props) {
  const theme = useTheme();
  const isSaltwater = species.waterType === WaterType.Saltwater;
  const imageUri = speciesImageUri(species.image);

  return (
    <View style={styles.outerPadding}>
      <Card>
        <View style={styles.contentContainer}>
          <Text>{species.name}</Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  headerWrapper: {
    alignItems: "flex-start",
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
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
