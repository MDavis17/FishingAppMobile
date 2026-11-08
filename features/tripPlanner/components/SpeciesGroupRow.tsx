import { MaterialCommunityIcons } from "@expo/vector-icons";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { IndividualCatch, SpeciesGroup } from "types";

interface Props {
  group: SpeciesGroup;
  expanded: boolean;
  onToggle: () => void;
}

export default function SpeciesGroupRow({ group, expanded, onToggle }: Props) {
  const theme = useTheme();
  const imageUri = group.speciesImage
    ? speciesImageUri(group.speciesImage)
    : "";

  const subtitleParts = [`${group.count} caught`];
  if (group.largestLength != null) {
    subtitleParts.push(`Largest ${group.largestLength} in`);
  }

  return (
    <View style={styles.groupContainer}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.groupRow, pressed && styles.pressed]}
      >
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
        <View style={styles.groupText}>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurface, fontWeight: "600" }}
          >
            {group.species}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {subtitleParts.join(" · ")}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? "chevron-down" : "chevron-right"}
          size={24}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>

      {expanded &&
        group.catches.map((item) => (
          <IndividualCatchRow key={item.id} item={item} />
        ))}
    </View>
  );
}

function IndividualCatchRow({ item }: { item: IndividualCatch }) {
  const theme = useTheme();
  const detailParts: string[] = [];
  if (item.length != null) {
    detailParts.push(`${item.length} in`);
  }
  if (item.bait) {
    detailParts.push(item.bait);
  }

  return (
    <View
      style={[
        styles.individualRow,
        { borderLeftColor: theme.colors.outlineVariant },
      ]}
    >
      <Text variant="bodySmall" style={styles.catchTime}>
        {item.time}
      </Text>
      {detailParts.length > 0 && (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
        >
          {detailParts.join(" · ")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 4,
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  thumbnailContainer: {
    width: 75,
    height: 50,
    borderRadius: 6,
    overflow: "hidden",
  },
  thumbnail: {
    width: 75,
    height: 40,
    resizeMode: "cover",
  },
  thumbnailPlaceholder: {
    width: 56,
    height: 40,
    borderRadius: 6,
  },
  groupText: {
    flex: 1,
  },
  individualRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 68,
    paddingVertical: 6,
    borderLeftWidth: 2,
    marginLeft: 28,
    marginBottom: 4,
  },
  catchTime: {
    minWidth: 64,
    fontWeight: "500",
  },
});
