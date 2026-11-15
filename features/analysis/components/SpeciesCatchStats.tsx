import Card from "common/components/Card";
import {
  formatBestMonth,
  formatCatchLength,
} from "features/analysis/utils/catchHistoryUtils";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  totalCatches: number;
  largestLength: number | null;
  bestMonth: number | null;
  lengthUnit: string;
}

interface StatConfig {
  label: string;
  value: string;
}

export default function SpeciesCatchStats({
  totalCatches,
  largestLength,
  bestMonth,
  lengthUnit,
}: Props) {
  const stats: StatConfig[] = [
    {
      label: "Total Caught",
      value: String(totalCatches),
    },
    {
      label: "Personal Best",
      value: formatCatchLength(largestLength, lengthUnit),
    },
    {
      label: "Best Month",
      value: formatBestMonth(bestMonth),
    },
  ];

  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <Card key={stat.label} style={styles.statContainer}>
          <Text style={styles.title}>{stat.label}</Text>
          <Text style={styles.value}>{stat.value}</Text>
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
    gap: 8,
    padding: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 20,
  },
});
