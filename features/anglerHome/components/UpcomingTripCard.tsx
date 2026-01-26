import React from "react";
import DashboardCard from "./DashboardCard";
import useTrips from "common/hooks/useTrips";
import { ActivityIndicator, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import PrimaryButton from "common/components/buttons/PrimaryButton";

export default function UpcomingTripCard() {
  const { isLoading, upcomingTrips } = useTrips();
  if (isLoading) {
    return <ActivityIndicator />;
  }

  const content = () => {
    if (upcomingTrips.length === 0) {
      return (
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={() => {}}>Plan a Trip</PrimaryButton>
        </View>
      );
    }

    const trip = upcomingTrips[0];
    return (
      <>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {trip.location.name}
        </Text>
        <Text>{new Date(trip.date).toLocaleDateString()}</Text>
      </>
    );
  };

  return (
    <DashboardCard
      title={"Upcoming Trip"}
      content={content()}
      actionButtonText="Prep for your trip"
      onActionPress={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
  },
});
