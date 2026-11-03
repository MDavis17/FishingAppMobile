import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SpeciesCatchHistoryItem } from "types";

interface Props {
  catches: SpeciesCatchHistoryItem[];
  totalCatches: number;
  lengthUnit: string;
}

function formatLength(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatWeight(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatCatchDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

function formatCatchLength(
  length: number | null | undefined,
  lengthUnit: string,
): string {
  if (length == null) {
    return "—";
  }
  return `${formatLength(length)} ${lengthUnit}`;
}

function formatCatchWeight(weight: number | null | undefined): string {
  if (weight == null) {
    return "—";
  }
  return `${formatWeight(weight)} lb`;
}

function CatchHistoryRow({
  item,
  lengthUnit,
}: {
  item: SpeciesCatchHistoryItem;
  lengthUnit: string;
}) {
  const theme = useTheme();

  return (
    <View style={styles.listRow}>
      <Text
        style={[
          styles.listCell,
          styles.dateCell,
          { color: theme.colors.onSurface },
        ]}
        numberOfLines={1}
      >
        {formatCatchDate(item.dateTime)}
      </Text>
      <Text
        style={[
          styles.listCell,
          styles.metricCell,
          { color: theme.colors.onSurface },
        ]}
        numberOfLines={1}
      >
        {formatCatchLength(item.length, lengthUnit)}
      </Text>
      <Text
        style={[
          styles.listCell,
          styles.metricCell,
          { color: theme.colors.onSurface },
        ]}
        numberOfLines={1}
      >
        {formatCatchWeight(item.weight)}
      </Text>
    </View>
  );
}

export default function SpeciesCatchHistoryList({
  catches,
  totalCatches,
  lengthUnit,
}: Props) {
  const theme = useTheme();
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      {showAll && (
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text
              style={[
                styles.listHeaderCell,
                styles.dateCell,
                { color: theme.colors.onSurface },
              ]}
            >
              Date
            </Text>
            <Text
              style={[
                styles.listHeaderCell,
                styles.metricCell,
                { color: theme.colors.onSurface },
              ]}
            >
              Length
            </Text>
            <Text
              style={[
                styles.listHeaderCell,
                styles.metricCell,
                { color: theme.colors.onSurface },
              ]}
            >
              Weight
            </Text>
          </View>
          {catches.map((item, index) => (
            <View key={item.id}>
              {index > 0 && (
                <View
                  style={[
                    styles.rowDivider,
                    { backgroundColor: theme.colors.outlineVariant },
                  ]}
                />
              )}
              <CatchHistoryRow item={item} lengthUnit={lengthUnit} />
            </View>
          ))}
        </View>
      )}
      <Pressable
        onPress={() => setShowAll((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={
          showAll ? "Hide catch history" : `View all ${totalCatches} catches`
        }
        style={({ pressed }) => [
          styles.toggleButton,
          pressed && styles.toggleButtonPressed,
        ]}
      >
        <MaterialCommunityIcons
          name={showAll ? "chevron-up" : "chevron-down"}
          size={24}
          color={theme.colors.primary}
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    alignSelf: "center",
    marginTop: 4,
    padding: 8,
  },
  toggleButtonPressed: {
    opacity: 0.7,
  },
  listSection: {
    marginTop: 8,
  },
  listHeaderRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  listRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  listHeaderCell: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.5,
    textTransform: "uppercase",
  },
  listCell: {
    fontSize: 13,
  },
  dateCell: {
    flex: 1.2,
  },
  metricCell: {
    flex: 1,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },
});
