import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { KelpBed, KelpData } from "common/api/marineApi";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Open",
  LEASABLE: "Leasable",
  LEASED: "Leased",
  CLOSED: "Closed",
  "CLOSED (TEMPORARILY)": "Temp. Closed",
};

interface Props {
  kelp: KelpData | null;
  isLoading: boolean;
}

export default function KelpCard({ kelp, isLoading }: Props) {
  const theme = useTheme();
  const beds = kelp?.kelp_beds ?? [];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Kelp Beds Nearby
        </Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
        ) : beds.length === 0 ? (
          <Text style={[styles.noBeds, { color: theme.colors.onSurface }]}>
            No designated kelp beds in immediate area
          </Text>
        ) : (
          <>
            <Text style={[styles.subLabel, { color: theme.colors.onSurfaceVariant }]}>
              {beds.length} bed{beds.length !== 1 ? "s" : ""} found within ~3.5 miles
            </Text>
            <View style={styles.bedList}>
              {beds.map((bed: KelpBed, i: number) => (
                <View key={i} style={[styles.bedChip, { borderColor: theme.colors.outline }]}>
                  <Text style={[styles.bedNumber, { color: theme.colors.onSurface }]}>
                    Bed #{bed.bed_number}
                  </Text>
                  <Text style={[styles.bedStatus, { color: statusColor(bed.status, theme) }]}>
                    {STATUS_LABEL[bed.status] ?? bed.status}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function statusColor(status: string, theme: any): string {
  switch (status) {
    case "OPEN":
      return theme.colors.primary;
    case "CLOSED":
    case "CLOSED (TEMPORARILY)":
      return theme.colors.error;
    default:
      return theme.colors.onSurfaceVariant;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    elevation: 2,
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  subLabel: {
    fontSize: 11,
    marginBottom: 8,
  },
  bedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  bedChip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  bedNumber: {
    fontSize: 13,
    fontWeight: "600",
  },
  bedStatus: {
    fontSize: 11,
  },
  noBeds: {
    fontSize: 13,
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 13,
  },
});
