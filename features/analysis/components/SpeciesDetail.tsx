import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList, WaterType, CatchEntry } from "types";
import Card from "common/components/Card";
import { speciesImageUri } from "../utils/imageUtils";
import { FRESHWATER_COLOR, SALTWATER_COLOR } from "common/theme/themes";
import { getCatchLogs } from "features/catchLog/api/getCatchLogs";
import { format } from "date-fns";
import Divider from "common/components/Divider";
import TargetMonths from "./TargetMonths";
import VerticalDivider from "common/components/VerticalDivider";
import BestBaits from "./BestBaits";
import CatchHistory from "./CatchHistory";

type SpeciesAnalysisRouteProp = RouteProp<RootStackParamList, "SpeciesDetail">;

export default function SpeciesDetail() {
  const theme = useTheme();
  const route = useRoute<SpeciesAnalysisRouteProp>();
  const { species } = route.params;

  const [catchHistory, setCatchHistory] = useState<CatchEntry[]>([]);
  const [catchHistoryLoading, setCatchHistoryLoading] = useState(true);

  // const fetchCatchHistory = useCallback(async () => {
  //   setCatchHistoryLoading(true);
  //   try {
  //     const response = await getCatchLogs();
  //     if (!response.ok) {
  //       throw new Error("Something went wrong");
  //     }
  //     const raw = response.data;
  //     const allCatches: CatchEntry[] = Array.isArray(raw)
  //       ? raw
  //       : Array.isArray((raw as { catches?: CatchEntry[] })?.catches)
  //         ? (raw as { catches: CatchEntry[] }).catches
  //         : Array.isArray((raw as { data?: CatchEntry[] })?.data)
  //           ? (raw as { data: CatchEntry[] }).data
  //           : [];
  //     const filtered = allCatches.filter(
  //       (c) => c.species?.toLowerCase() === species.name?.toLowerCase(),
  //     );
  //     setCatchHistory(filtered);
  //   } catch (error) {
  //     console.error("Error fetching catch history:", error);
  //     setCatchHistory([]);
  //   } finally {
  //     setCatchHistoryLoading(false);
  //   }
  // }, [species.name]);

  // useEffect(() => {
  //   fetchCatchHistory();
  // }, [fetchCatchHistory]);

  const isSaltwater = species.waterType === WaterType.Saltwater;
  const imageUri = speciesImageUri(species.image);
  const rangeMapImageUrl = speciesImageUri(species.rangeMapUrl ?? "");
  const description = species.description || "No description available.";
  // const bestMonths = species.bestMonths ?? [];
  const bestMonths = [6, 7, 8, 9];
  // const bestBaits = species.bestBaits ?? [];
  const bestBaits = [{ name: "Live Sardine" }, { name: "Squid" }];
  const mockCatchHistory = [
    {
      dateTime: "2026-01-01",
      location: { name: "San Diego Bay" },
      bait: "Live Sardine",
      species: "California Halibut",
      waterType: WaterType.Saltwater,
    } as CatchEntry,
    {
      dateTime: "2026-01-02",
      location: { name: "San Francisco Bay" },
      bait: "Squid",
      species: "Pacific Halibut",
      waterType: WaterType.Saltwater,
    } as CatchEntry,
  ];

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.speciesName}>
          {species.name}
        </Text>
        <View
          style={[
            styles.waterTypeTag,
            {
              backgroundColor: isSaltwater ? SALTWATER_COLOR : FRESHWATER_COLOR,
            },
          ]}
        >
          <Text style={[styles.tagText, { color: theme.colors.onPrimary }]}>
            {species.waterType}
          </Text>
        </View>
      </View>

      <Divider />

      <View style={styles.identificationContainer}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.speciesImage}
              resizeMode="cover"
            />
          ) : null}
        </View>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {description}
        </Text>
      </View>

      <Divider />

      <View style={styles.detailsContainer}>
        <View style={styles.regionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Region
          </Text>
          {rangeMapImageUrl ? (
            <Image
              source={{ uri: rangeMapImageUrl }}
              style={styles.regionImage}
              resizeMode="cover"
            />
          ) : null}
        </View>

        <VerticalDivider />

        <View style={styles.targetsContainer}>
          <View>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Best Time to Target
            </Text>
            <View style={{ paddingHorizontal: 4 }}>
              <TargetMonths bestMonths={bestMonths} />
            </View>
          </View>
          <Divider />
          <View style={styles.bestBaitsContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Best Baits
            </Text>
            <View style={{ paddingHorizontal: 4 }}>
              <BestBaits bestBaits={bestBaits} />
            </View>
          </View>
        </View>
      </View>

      <Divider />

      <View style={styles.historyContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Catch History
        </Text>
        <CatchHistory catchHistory={mockCatchHistory} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waterTypeTag: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  speciesName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  identificationContainer: { flex: 1, paddingVertical: 6 },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  speciesImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  regionImage: {
    height: 150,
    width: 175,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  regionContainer: { flex: 1 },
  regionImageContainer: {
    flex: 1,
    height: 150,
    width: "100%",
    backgroundColor: "red",
  },
  targetsContainer: { flex: 1 },
  sectionTitle: { marginBottom: 8, fontWeight: "bold" },
  // timeToTargetContainer: { flex: 1 },
  bestBaitsContainer: { flex: 1 },
  bestMonthsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthsRangeContainer: { paddingHorizontal: 16 },
  historyContainer: { flex: 1 },
});
