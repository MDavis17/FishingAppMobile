import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useLocation } from "common/context/LocationContext";
import useConditionsWeather from "../hooks/useConditionsWeather";
import TemperatureCardStatic from "./TemperatureCardStatic";

export default function Conditions() {
  const { location } = useLocation();
  const { weather, isLoading, error } = useConditionsWeather(location);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <TemperatureCardStatic
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
