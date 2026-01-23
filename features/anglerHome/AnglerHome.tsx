import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import HomeCard from "./HomeCard";

export default function AnglerHome() {
  return (
    <ScrollView style={styles.container}>
      <HomeCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
