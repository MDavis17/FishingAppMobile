import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import UpcomingTripCard from "./UpcomingTripCard";
import RecentTripCard from "./RecentTripCard";
import HomeFab from "./HomeFab";

export default function AnglerHome() {
  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          <UpcomingTripCard />
        </View>
        <View style={styles.cardContainer}>
          <RecentTripCard />
        </View>
      </ScrollView>
      <HomeFab />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    paddingVertical: 4,
  },
});
