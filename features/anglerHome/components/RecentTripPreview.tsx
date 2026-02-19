import React from "react";
import { Text } from "react-native-paper";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Divider from "common/components/Divider";
import MapWindow from "common/components/MapWindow";
import useRecentTrip from "common/hooks/useRecentTrip";

export default function RecentTripPreview() {
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
          <Text style={styles.heading}>{recentTrip.location.name}</Text>
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
  heading: { fontSize: 16, fontWeight: "bold" },
  centeredText: { textAlign: "center" },
});
