import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Trip } from "types";

interface Props {
  trip: Trip;
}

export default function TripStatusChip({ trip }: Props) {
  const isTripCompleted = trip.status === "Completed";
  const chipColor = isTripCompleted ? "green" : "blue";
  return (
    <View style={styles.container}>
      {/* <View style={styles.headerWrapper}>
        <View style={[styles.header, { borderColor: chipColor }]}> */}
      <Text style={[styles.heading, { color: chipColor }]}>{trip.status}</Text>
      {/* </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  headerWrapper: {
    alignItems: "flex-start",
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  completedContainer: { color: "green" },
  plannedContainer: { color: "blue" },
  heading: { fontSize: 12, fontWeight: "bold" },
  centeredText: { textAlign: "center" },
});
