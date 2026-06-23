import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { AstronomyData } from "common/api/marineApi";

function formatTime(t: string | null | undefined): string {
  if (!t) return "—";
  // USNO returns times like "05:52" (24h) or possibly with AM/PM
  const parts = t.split(":");
  if (parts.length < 2) return t;
  const h = parseInt(parts[0], 10);
  const m = parts[1];
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface Props {
  astronomy: AstronomyData | null;
  isLoading: boolean;
}

export default function AstronomyCard({ astronomy, isLoading }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
          Moon & Sun
        </Text>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
        ) : !astronomy ? (
          <Text style={[styles.unavailable, { color: theme.colors.onSurface }]}>Data unavailable</Text>
        ) : (
          <>
            <View style={styles.row}>
              <DataItem label="Sunrise" value={formatTime(astronomy.sunrise)} />
              <DataItem label="Sunset" value={formatTime(astronomy.sunset)} />
            </View>
            {astronomy.moon && (
              <>
                <View style={styles.row}>
                  <DataItem
                    label="Moon Phase"
                    value={astronomy.moon.phase_name ?? "—"}
                  />
                  <DataItem
                    label="Illumination"
                    value={
                      astronomy.moon.illumination_pct != null
                        ? `${astronomy.moon.illumination_pct}%`
                        : "—"
                    }
                  />
                </View>
                <View style={styles.row}>
                  <DataItem label="Moonrise" value={formatTime(astronomy.moon.moonrise)} />
                  <DataItem label="Moonset" value={formatTime(astronomy.moon.moonset)} />
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.dataItem}>
      <Text style={[styles.dataLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.dataValue, { color: theme.colors.onSurface }]}>{value}</Text>
    </View>
  );
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
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 11,
    marginBottom: 1,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 13,
  },
  unavailable: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
