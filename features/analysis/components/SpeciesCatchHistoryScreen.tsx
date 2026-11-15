import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import Card from "common/components/Card";
import useSpeciesCatchHistory from "features/analysis/hooks/useSpeciesCatchHistory";
import useSpeciesFavoriteHeader from "features/analysis/hooks/useSpeciesFavoriteHeader";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import {
  CatchHistorySort,
  CatchHistoryYearFilter,
  catchHistoryStatsInput,
  filterCatchesByYear,
  sortCatches,
  yearFilterCounts,
} from "features/analysis/utils/catchHistoryUtils";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Chip, Menu, Text, useTheme } from "react-native-paper";
import { RootStackParamList } from "types";
import SpeciesCatchHistoryList from "./SpeciesCatchHistoryList";
import SpeciesCatchStats from "./SpeciesCatchStats";

type CatchHistoryRoute = RouteProp<RootStackParamList, "SpeciesCatchHistory">;

const PAGE_SIZE = 5;

const SORT_LABELS: Record<CatchHistorySort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  longest: "Longest",
};

export default function SpeciesCatchHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<CatchHistoryRoute>();
  const { species: initialSpecies } = route.params;
  const species = route.params.species ?? initialSpecies;

  useSpeciesFavoriteHeader("SpeciesCatchHistory", species);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: species.name,
    });
  }, [navigation, species.name]);

  const { history, isLoading, error } = useSpeciesCatchHistory(species.id);
  const lengthUnit = species.lengthUnits ?? "in";
  const imageUri = speciesImageUri(species.image);

  const [yearFilter, setYearFilter] = useState<CatchHistoryYearFilter>("all");
  const [sort, setSort] = useState<CatchHistorySort>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const allCatches = history?.catches ?? [];

  const counts = useMemo(
    () => yearFilterCounts(allCatches),
    [allCatches],
  );

  const filteredSorted = useMemo(() => {
    const filtered = filterCatchesByYear(allCatches, yearFilter);
    return sortCatches(filtered, sort);
  }, [allCatches, sort, yearFilter]);

  const visibleCatches = filteredSorted.slice(0, visibleCount);
  const pbId = history?.personalBest?.id ?? null;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [yearFilter, sort]);

  const statsProps = catchHistoryStatsInput(history, lengthUnit);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <Text variant="bodyMedium" style={styles.error}>
            {error}
          </Text>
        ) : (
          <>
            <SpeciesCatchStats {...statsProps} />

            <View style={styles.filterRow}>
              <View style={styles.chips}>
                <Chip
                  mode="outlined"
                  selected={yearFilter === "all"}
                  onPress={() => setYearFilter("all")}
                  style={styles.chip}
                >
                  {`All (${counts.all})`}
                </Chip>
                <Chip
                  mode="outlined"
                  selected={yearFilter === "thisYear"}
                  onPress={() => setYearFilter("thisYear")}
                  style={styles.chip}
                >
                  {`This Year (${counts.thisYear})`}
                </Chip>
                <Chip
                  mode="outlined"
                  selected={yearFilter === "lastYear"}
                  onPress={() => setYearFilter("lastYear")}
                  style={styles.chip}
                >
                  {`Last Year (${counts.lastYear})`}
                </Chip>
              </View>
              <Menu
                visible={sortMenuOpen}
                onDismiss={() => setSortMenuOpen(false)}
                anchor={
                  <Pressable
                    onPress={() => setSortMenuOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Sort catches"
                    style={({ pressed }) => [
                      styles.sortButton,
                      {
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="sort"
                      size={18}
                      color={theme.colors.onSurface}
                    />
                    <Text variant="labelLarge">{SORT_LABELS[sort]}</Text>
                  </Pressable>
                }
              >
                {(Object.keys(SORT_LABELS) as CatchHistorySort[]).map(
                  (option) => (
                    <Menu.Item
                      key={option}
                      onPress={() => {
                        setSort(option);
                        setSortMenuOpen(false);
                      }}
                      title={SORT_LABELS[option]}
                    />
                  ),
                )}
              </Menu>
            </View>

            {filteredSorted.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyFilter}>
                No catches for this period.
              </Text>
            ) : (
              <SpeciesCatchHistoryList
                catches={visibleCatches}
                lengthUnit={lengthUnit}
                defaultSpeciesImageUri={imageUri}
                personalBestId={pbId}
              />
            )}

            {filteredSorted.length > 0 ? (
              <Text variant="bodySmall" style={styles.footerStatus}>
                {`Showing ${Math.min(visibleCount, filteredSorted.length)} of ${filteredSorted.length} catches`}
              </Text>
            ) : null}

            {visibleCount < filteredSorted.length ? (
              <SecondaryButton onPress={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                Load More
              </SecondaryButton>
            ) : null}
          </>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  card: {
    margin: 8,
    padding: 12,
    gap: 12,
  },
  loader: {
    marginVertical: 24,
  },
  error: {
    textAlign: "center",
    opacity: 0.7,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
  },
  chips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    marginVertical: 0,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  emptyFilter: {
    textAlign: "center",
    opacity: 0.7,
    paddingVertical: 16,
  },
  footerStatus: {
    textAlign: "center",
    opacity: 0.65,
    marginTop: 8,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});