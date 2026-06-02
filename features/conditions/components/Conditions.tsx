import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useLocation } from "common/context/LocationContext";
import useConditionsWeather from "../hooks/useConditionsWeather";
import TemperatureCard from "./TemperatureCard";

export default function Conditions() {
  const { location } = useLocation();
  const { weather, isLoading, error } = useConditionsWeather(location);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <TemperatureCard
          weather={weather}
          isLoading={isLoading}
          error={error}
        />
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
