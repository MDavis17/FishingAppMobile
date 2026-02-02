import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import UpcomingTripCard from "./UpcomingTripCard";
import RecentTripCard from "./RecentTripCard";

export default function AnglerHome() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <UpcomingTripCard />
      </View>
      <View style={styles.cardContainer}>
        <RecentTripCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    paddingVertical: 4
  }
});
