import React from "react";
import DashboardCard from "./DashboardCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import RecentTripPreview from "./RecentTripPreview";
import useRecentTrip from "common/hooks/useRecentTrip";
import { navigateToTripDetail } from "features/tripPlanner/navigation/navigateToTripDetail";

export default function RecentTripCard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recentTrip } = useRecentTrip();

  const onActionPress = () => {
    if (recentTrip) {
      navigateToTripDetail(navigation, recentTrip);
    }
  };

  return (
    <DashboardCard
      title={"Recent Trip"}
      content={<RecentTripPreview />}
      actionButtonText={"Analyze your Trip"}
      onActionPress={onActionPress}
    />
  );
}
