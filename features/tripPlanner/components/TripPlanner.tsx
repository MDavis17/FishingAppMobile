import React from "react";
import { View } from "react-native";
import TripList from "./TripList";

export default function TripPlanner() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TripList />
    </View>
  );
}
