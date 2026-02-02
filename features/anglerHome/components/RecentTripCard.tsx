import React from "react";
import DashboardCard from "./DashboardCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import RecentTripPreview from "./RecentTripPreview";

export default function RecentTripCard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const onActionPress = () => {
      navigation.navigate("Plan");
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
