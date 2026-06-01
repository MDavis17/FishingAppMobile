import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ConditionsCard from "./ConditionsCard";

export default function Conditions() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <ConditionsCard />
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
    paddingVertical: 4,
  },
});
