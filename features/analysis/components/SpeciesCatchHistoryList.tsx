import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  formatCatchDate,
  formatCatchLength,
} from "features/analysis/utils/catchHistoryUtils";
import {
  PhotoItem,
  SpeciesPhotoViewer,
} from "features/analysis/components/SpeciesPhotosCard";
import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SpeciesCatchHistoryItem } from "types";

interface Props {
  catches: SpeciesCatchHistoryItem[];
  lengthUnit: string;
  defaultSpeciesImageUri: string;
  personalBestId: number | null;
}

function CatchHistoryRow({
  item,
  lengthUnit,
  imageUri,
  isPersonalBest,
  onImagePress,
}: {
  item: SpeciesCatchHistoryItem;
  lengthUnit: string;
  imageUri: string;
  isPersonalBest: boolean;
  onImagePress: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onImagePress}
        accessibilityRole="button"
        accessibilityLabel="View catch photo"
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />
      </Pressable>
      <View style={styles.meta}>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={14}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {formatCatchDate(item.dateTime)}
          </Text>
        </View>
      </View>
      <View style={styles.lengthWrap}>
        {isPersonalBest ? (
          <View
            style={[
              styles.pbBadge,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <MaterialCommunityIcons
              name="trophy"
              size={14}
              color={theme.colors.primary}
            />
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              {formatCatchLength(item.length, lengthUnit)}
            </Text>
          </View>
        ) : (
          <Text
            variant="titleSmall"
            style={[styles.lengthText, { color: theme.colors.onSurface }]}
          >
            {formatCatchLength(item.length, lengthUnit)}
          </Text>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={theme.colors.outline}
      />
    </View>
  );
}

export default function SpeciesCatchHistoryList({
  catches,
  lengthUnit,
  defaultSpeciesImageUri,
  personalBestId,
}: Props) {
  const theme = useTheme();
  const [viewerVisible, setViewerVisible] = useState(false);

  const viewerItems: PhotoItem[] = useMemo(
    () => (defaultSpeciesImageUri ? [{ uri: defaultSpeciesImageUri }] : []),
    [defaultSpeciesImageUri],
  );

  const resolveImageUri = (_item: SpeciesCatchHistoryItem) =>
    defaultSpeciesImageUri;

  return (
    <>
      <View style={styles.list}>
        {catches.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
            ) : null}
            <CatchHistoryRow
              item={item}
              lengthUnit={lengthUnit}
              imageUri={resolveImageUri(item)}
              isPersonalBest={personalBestId != null && item.id === personalBestId}
              onImagePress={() => setViewerVisible(true)}
            />
          </View>
        ))}
      </View>
      {viewerItems.length > 0 ? (
        <SpeciesPhotoViewer
          visible={viewerVisible}
          items={viewerItems}
          initialIndex={0}
          onClose={() => setViewerVisible(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: 4,
    resizeMode: "cover",
  },
  meta: {
    flex: 1,
    justifyContent: "center",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lengthWrap: {
    alignItems: "flex-end",
    minWidth: 72,
  },
  lengthText: {
    fontWeight: "600",
  },
  pbBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.75,
  },
});