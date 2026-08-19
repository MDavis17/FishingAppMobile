import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useLocation } from "common/context/LocationContext";
import useConditionsWeather from "../hooks/useConditionsWeather";
import useMarineConditions from "../hooks/useMarineConditions";
import TemperatureCardStatic from "./TemperatureCardStatic";
import WaterTemperatureCard from "./WaterTemperatureCard";

export default function Conditions() {
  const { location } = useLocation();
  const { weather, isLoading: weatherLoading, error: weatherError } = useConditionsWeather(location);
  const { conditions, isLoading: conditionsLoading, error: conditionsError } = useMarineConditions(location);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <TemperatureCardStatic
          weather={weather}
          isLoading={weatherLoading}
          error={weatherError}
        />
      </View>
      <View style={styles.cardContainer}>
        <WaterTemperatureCard
          conditions={conditions}
          isLoading={conditionsLoading}
          error={conditionsError}
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
