import React from "react";
import { Text } from "react-native-paper";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Divider from "common/components/Divider";
import MapWindow from "common/components/MapWindow";
import useRecentTrip from "common/hooks/useRecentTrip";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function RecentTripPreview() {
  const theme = useTheme();
  const { isLoading, recentTrip } = useRecentTrip();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!recentTrip) {
    return (
      <View>
        <Text
          style={[styles.heading, styles.centeredText, { paddingBottom: 4 }]}
        >
          No recent trips completed
        </Text>
        <Text style={styles.centeredText}>
          When you complete a trip, it'll show up here so you can analyze it.
        </Text>
      </View>
    );
  }

  const tripHasCatches = recentTrip.catchList.length > 0;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(recentTrip.date));

  return (
    <View>
      <View style={styles.locationContainer}>
        <View style={styles.locationDescription}>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.heading}>{recentTrip.location.name}</Text>
            {recentTrip.savedLocationId != null && (
              <MaterialCommunityIcons
                name="bookmark"
                size={18}
                color={theme.colors.primary}
              />
            )}
          </View>
          <Divider />
          <Text>{tripHasCatches ? recentTrip.catchSummary : "No Catches"}</Text>
        </View>
        <View style={styles.locationThumbnail}>
          <MapWindow
            selectedLocation={recentTrip.location.coordinates}
            isViewOnly
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: { flexDirection: "row" },
  locationDescription: { flex: 1 },
  locationThumbnail: { flex: 1, paddingLeft: 24 },
  date: { fontSize: 16, paddingBottom: 4 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  heading: { fontSize: 16, fontWeight: "bold" },
  centeredText: { textAlign: "center" },
});
