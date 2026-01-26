import React from "react";
import useTrips from "common/hooks/useTrips";
import { ActivityIndicator, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function UpcomingTripPreview() {
  const { isLoading, upcomingTrips } = useTrips();
  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (upcomingTrips.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No trips planned</Text>
        <Text>
          When you plan a trip, it’ll show up here with the forecast and prep
          tips.
        </Text>
      </View>
    );
  }

  const firstTrip = upcomingTrips[0];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{firstTrip.location.name}</Text>
      <Text>{new Date(firstTrip.date).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  heading: { fontSize: 16, fontWeight: "bold", paddingBottom: 4 },
  emptyStateContainer: {},
});
