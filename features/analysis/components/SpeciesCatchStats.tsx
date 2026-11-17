import Card from "common/components/Card";
import {
  formatCatchDate,
  formatCatchLength,
} from "features/analysis/utils/catchHistoryUtils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { SpeciesCatchHistoryItem } from "types";

interface Props {
  // totalCatches: number;
  personalBest: SpeciesCatchHistoryItem | null;
  mostRecentCatch: SpeciesCatchHistoryItem | null;
  lengthUnit: string;
}

interface StatConfig {
  label: string;
  primary: string;
  secondary?: string;
  generalLocationName?: string | null;
}

function statFromCatch(
  label: string,
  catchItem: SpeciesCatchHistoryItem | null,
  lengthUnit: string,
): StatConfig {
  return {
    label,
    primary: formatCatchLength(catchItem?.length, lengthUnit),
    secondary: catchItem ? formatCatchDate(catchItem.dateTime) : "—",
    generalLocationName: catchItem?.generalLocationName,
  };
}

export default function SpeciesCatchStats({
  // totalCatches,
  personalBest,
  mostRecentCatch,
  lengthUnit,
}: Props) {
  const theme = useTheme();
  const stats: StatConfig[] = [
    // {
    //   label: "Total Caught",
    //   primary: String(totalCatches),
    // },
    statFromCatch("Personal Best", personalBest, lengthUnit),
    statFromCatch("Most Recent", mostRecentCatch, lengthUnit),
  ];

  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <Card key={stat.label} style={styles.statContainer}>
          <Text style={styles.title}>{stat.label}</Text>
          <Text style={styles.value}>{stat.primary}</Text>
          {stat.secondary != null ? (
            <Text style={styles.secondary}>{stat.secondary}</Text>
          ) : null}
          {stat.generalLocationName ? (
            <View style={styles.locationRow}>
              <Icon
                source="map-marker"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[styles.secondary, styles.locationText]}
                numberOfLines={2}
              >
                {stat.generalLocationName}
              </Text>
            </View>
          ) : null}
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  statContainer: {
    flex: 1,
    gap: 4,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  value: {
    fontSize: 20,
    textAlign: "center",
  },
  secondary: {
    fontSize: 12,
    opacity: 0.65,
    textAlign: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    maxWidth: "100%",
  },
  locationText: {
    flexShrink: 1,
    textAlign: "left",
  },
});
