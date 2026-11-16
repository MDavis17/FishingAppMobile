import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useSpeciesCatchHistory from "features/analysis/hooks/useSpeciesCatchHistory";
import { catchHistoryStatsInput } from "features/analysis/utils/catchHistoryUtils";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { RootStackParamList, Species } from "types";
import Card from "common/components/Card";
import SpeciesCatchMonthChart from "./SpeciesCatchMonthChart";
import SpeciesCatchStats from "./SpeciesCatchStats";

interface Props {
  species: Species;
}

export default function SpeciesCatchHistoryCard({ species }: Props) {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { history, isLoading, error } = useSpeciesCatchHistory(species.id);
  const lengthUnit = species.lengthUnits ?? "in";

  const totalCatches = history?.totalCatches ?? 0;

  const statsProps = catchHistoryStatsInput(history, lengthUnit);

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
        <View style={styles.empty}>
          <Text variant="bodyMedium">You haven't caught this species yet.</Text>
        </View>
      );
    }

    return (
      <View style={styles.body}>
        <SpeciesCatchStats {...statsProps} />
        {history?.monthlyCounts?.length ? (
          <SpeciesCatchMonthChart monthlyCounts={history.monthlyCounts} />
        ) : null}
      </View>
    );
  })();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium">Catch History</Text>
        {totalCatches > 0 ? (
          <Pressable
            onPress={() =>
              navigation.navigate("SpeciesCatchHistory", { species })
            }
            accessibilityRole="button"
            accessibilityLabel={`View all ${totalCatches} catches`}
            style={({ pressed }) => [
              styles.viewAll,
              pressed && styles.viewAllPressed,
            ]}
          >
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.primary }}
            >
              {`View All (${totalCatches})`}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.colors.primary}
            />
          </Pressable>
        ) : null}
      </View>
      <View>{content}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingLeft: 8,
  },
  viewAllPressed: {
    opacity: 0.7,
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
  empty: {
    paddingBottom: 8,
  },
  body: {
    gap: 12,
  },
});