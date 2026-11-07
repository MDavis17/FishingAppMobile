import React from "react";
import DashboardCard from "./DashboardCard";
import UpcomingTripPreview from "./UpcomingTripPreview";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import useUpcomingTrip from "common/hooks/useUpcomingTrip";
import { navigateToTripDetail } from "features/tripPlanner/navigation/navigateToTripDetail";

export default function UpcomingTripCard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { upcomingTrip } = useUpcomingTrip();

  const actionText = () => {
    if (upcomingTrip) {
      return "Prep for your Trip";
    }
    return "Plan a Trip";
  };

  const onActionPress = () => {
    if (upcomingTrip) {
      navigateToTripDetail(navigation, upcomingTrip);
    } else {
      navigation.navigate("NewTrip");
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
