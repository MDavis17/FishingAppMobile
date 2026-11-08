import Card from "common/components/Card";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { TripCatchListResponse } from "types";
import CatchStatPill from "./CatchStatPill";
import SpeciesGroupRow from "./SpeciesGroupRow";

interface Props {
  catchList: TripCatchListResponse | null;
  isLoading: boolean;
  onAddCatchPress: () => void;
}

export default function TripCatchSummary({
  catchList,
  isLoading,
  onAddCatchPress,
}: Props) {
  const [expandedSpecies, setExpandedSpecies] = useState<Set<string>>(
    new Set(),
  );

  const toggleSpecies = (species: string) => {
    setExpandedSpecies((prev) => {
      const next = new Set(prev);
      if (next.has(species)) {
        next.delete(species);
      } else {
        next.add(species);
      }
      return next;
    });
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Catch Summary
        </Text>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : catchList ? (
          <>
            {catchList.stats.length > 0 && (
              <View style={styles.statsRow}>
                {catchList.stats.map((stat) => (
                  <CatchStatPill key={stat.type} stat={stat} />
                ))}
              </View>
            )}

            <ScrollView
              style={styles.listScroll}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {catchList.speciesGroups.map((group) => (
                <SpeciesGroupRow
                  key={group.species}
                  group={group}
                  expanded={expandedSpecies.has(group.species)}
                  onToggle={() => toggleSpecies(group.species)}
                />
              ))}
            </ScrollView>

            <SecondaryButton onPress={onAddCatchPress}>
              Add New Catch
            </SecondaryButton>
          </>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12, fontWeight: "bold" },
  card: { flex: 1 },
  loader: { marginVertical: 16 },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  listScroll: {
    maxHeight: 320,
    marginBottom: 12,
  },
});
