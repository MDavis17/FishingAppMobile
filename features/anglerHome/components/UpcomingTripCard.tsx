import React from "react";
import DashboardCard from "./DashboardCard";
import UpcomingTripPreview from "./UpcomingTripPreview";
import useTrips from "common/hooks/useTrips";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";

export default function UpcomingTripCard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { upcomingTrips, createNewTrip } = useTrips();

  const hasUpcomingTrip = upcomingTrips.length > 0;
  console.log("UpcomingTripCard - hasUpcomingTrip:", hasUpcomingTrip);

  const actionText = () => {
    if (hasUpcomingTrip) {
      return "Prep for your Trip";
    }
    return "Plan a Trip";
  };

  const onActionPress = () => {
    if (hasUpcomingTrip) {
      navigation.navigate("Plan");
    } else {
      navigation.navigate("Fishing Log", {
        screen: "NewTrip",
        params: { createNewTrip },
        options: { presentation: "modal", title: "New Trip" },
      });
    }
  };

  return (
    <DashboardCard
      title={"Upcoming Trip"}
      content={<UpcomingTripPreview />}
      actionButtonText={actionText()}
      onActionPress={onActionPress}
    />
  );
}
