import { useState } from "react";
import ConditionChip from "features/tripPlanner/components/ConditionChip";
import { TripTidesData } from "common/api/getTripTides";
import { TripTidesStatus } from "features/tripPlanner/hooks/useTripConditions";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import TripTideRow from "./TripTideRow";
import TideChart, { tideEventKey } from "./TideChart";

interface Props {
  tides: TripTidesData | null;
  tidesStatus: TripTidesStatus;
}

export default function TripTides({ tides, tidesStatus }: Props) {
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  if (tidesStatus === "error") {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Tides
        </Text>
        <Text variant="bodySmall" style={styles.message}>
          Couldn&apos;t load tides.
        </Text>
      </View>
    );
  }

  if (!tides) {
    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Tides
        </Text>
        <Text variant="bodySmall" style={styles.message}>
          No tide data available.
        </Text>
      </View>
    );
  }

  const heights = tides.heights ?? [];
  const showChart = heights.length > 0;

  const handleSelectEvent = (key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>
          Tides
        </Text>
        <ConditionChip source={tides.source} />
        <View style={styles.stationContainer}>
          <Text variant="bodySmall" style={styles.station}>
            {tides.station_name} · {tides.station_distance_mi.toFixed(0)} mi
          </Text>
        </View>
      </View>
      {tides.events.length === 0 ? (
        <Text variant="bodySmall" style={styles.message}>
          No tide data for this day.
        </Text>
      ) : (
        <>
          {showChart && (
            <TideChart
              heights={heights}
              events={tides.events}
              selectedKey={selectedKey}
              onSelectEvent={handleSelectEvent}
            />
          )}
          <View
            style={[
              styles.summaryStrip,
              {
                borderColor: theme.colors.surfaceVariant,
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            <View style={styles.summaryRow}>
              {tides.events.map((event, index) => {
                const key = tideEventKey(event);
                const selected = key === selectedKey;
                return (
                  <View key={key} style={styles.summaryItem}>
                    {index > 0 ? (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: theme.colors.surfaceVariant },
                        ]}
                      />
                    ) : null}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${event.kind} tide`}
                      onPress={() => handleSelectEvent(key)}
                      style={[
                        styles.summaryCellWrap,
                        selected && {
                          borderColor: theme.colors.primary,
                          backgroundColor: theme.colors.surface,
                        },
                      ]}
                    >
                      <TripTideRow
                        event={event}
                        layout="column"
                        style={styles.summaryCell}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontWeight: "bold" },
  station: { opacity: 0.75 },
  stationContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  message: { textAlign: "center", opacity: 0.8 },
  summaryStrip: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  summaryCellWrap: {
    flex: 1,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    margin: 2,
  },
  summaryCell: { flex: 1 },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
