import React from "react";
import DashboardCard from "./DashboardCard";
import UpcomingTripPreview from "./UpcomingTripPreview";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import useUpcomingTrip from "common/hooks/useUpcomingTrip";

export default function UpcomingTripCard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { upcomingTrip, createNewTrip } = useUpcomingTrip();

  const actionText = () => {
    if (upcomingTrip) {
      return "Prep for your Trip";
    }
    return "Plan a Trip";
  };

  const onActionPress = () => {
    if (upcomingTrip) {
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
