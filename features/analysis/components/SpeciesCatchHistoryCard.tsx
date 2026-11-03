import useSpeciesCatchHistory from "features/analysis/hooks/useSpeciesCatchHistory";
import { format, parseISO } from "date-fns";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Species } from "types";
import Card from "common/components/Card";
import SpeciesCatchHistoryList from "./SpeciesCatchHistoryList";

interface Props {
  species: Species;
}

interface StatItem {
  label: string;
  value: string;
}

function formatLength(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatCatchDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export default function SpeciesCatchHistoryCard({ species }: Props) {
  const theme = useTheme();
  const { history, isLoading, error } = useSpeciesCatchHistory(species.id);
  const lengthUnit = species.lengthUnits ?? "in";

  const catches = history?.catches ?? [];

  const stats: StatItem[] = useMemo(() => {
    const totalCatches = history?.totalCatches ?? 0;
    const largestLength = history?.largestLength ?? null;
    const mostRecent = history?.mostRecentCatchDate ?? null;

    const longestValue =
      largestLength !== null
        ? `${formatLength(largestLength)} ${lengthUnit}`
        : "—";

    const lastCaughtValue = mostRecent ? formatCatchDate(mostRecent) : "—";

    return [
      { label: "Caught", value: String(totalCatches) },
      { label: "Longest", value: longestValue },
      { label: "Last caught", value: lastCaughtValue },
    ];
  }, [history, lengthUnit]);

  const content = (() => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text variant="bodySmall" style={styles.statusText}>
            Loading catch history...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text variant="bodySmall" style={styles.statusText}>
            {error}
          </Text>
        </View>
      );
    }

    if (history?.totalCatches === 0) {
      return (
        <View style={{ paddingBottom: 8 }}>
          <Text variant="bodyMedium">You haven't caught this species yet.</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.stat,
                styles.shadow,
                { backgroundColor: theme.colors.background },
              ]}
            >
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
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.listContainer}>
          <SpeciesCatchHistoryList
            catches={catches}
            totalCatches={history?.totalCatches ?? catches.length}
            lengthUnit={lengthUnit}
          />
        </View>
      </View>
    );
  })();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium">Your catch history</Text>
      </View>
      <View>{content}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  centered: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  statusText: {
    opacity: 0.7,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
    columnGap: 8,
  },
  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
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
  listContainer: {
    paddingHorizontal: 8,
  },
});
