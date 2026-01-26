import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import UpcomingTripCard from "./UpcomingTripCard";

export default function AnglerHome() {
  return (
    <ScrollView style={styles.container}>
      <UpcomingTripCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
