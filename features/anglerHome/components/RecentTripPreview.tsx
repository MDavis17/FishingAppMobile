import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import Divider from "common/components/Divider";
import MapWindow from "common/components/MapWindow";
import useTrips from "common/hooks/useTrips";

export default function RecentTripPreview() {
  // new hook and route
  const { trips } = useTrips()

  if(trips.length === 0 ) {
    return null;
  }
  const trip = trips[0];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(trips[0].date));

  return (
    <View>
      <View style={styles.locationContainer}>
        <View style={styles.locationDescription}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.heading}>{trip.location.name}</Text>
          <Divider />
          <Text>{trip.catchSummary}</Text>
        </View>
        <View style={styles.locationThumbnail}>
          <MapWindow
            selectedLocation={trip.location.coordinates}
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
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
  },
  centeredText: { textAlign: "center" },
});
