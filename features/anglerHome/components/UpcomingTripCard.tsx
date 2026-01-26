import React from "react";
import DashboardCard from "./DashboardCard";
import UpcomingTripPreview from "./UpcomingTripPreview";
import useTrips from "common/hooks/useTrips";

export default function UpcomingTripCard() {
  const { upcomingTrips } = useTrips();

  const actionText = () => {
    if (upcomingTrips.length === 0) {
      return "Plan a Trip";
    }
    return "Prep for your Trip";
  };

  return (
    <DashboardCard
      title={"Upcoming Trip"}
      content={<UpcomingTripPreview />}
      actionButtonText={actionText()}
      onActionPress={() => {}}
    />
  );
}
