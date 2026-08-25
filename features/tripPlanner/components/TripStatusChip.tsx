import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Trip } from "types";

interface Props {
  status: Trip["status"];
}

const PLANNED_COLOR = "#274a96";
const COMPLETED_COLOR = "#3a895c";

function PlannedStatusChip() {
  return (
    <>
      <MaterialCommunityIcons name="calendar" size={14} color={PLANNED_COLOR} />
      <Text style={[styles.text, { color: PLANNED_COLOR }]}>Planned</Text>
    </>
  );
}

function CompletedStatusChip() {
  return (
    <>
      <MaterialCommunityIcons name="check" size={14} color={COMPLETED_COLOR} />
      <Text style={[styles.text, { color: COMPLETED_COLOR }]}>Completed</Text>
    </>
  );
}

export default function TripStatusChip({ status }: Props) {
  const isTripCompleted = status === "Completed";
  return (
    <View style={styles.headerWrapper}>
      <View
        style={[
          styles.header,
          isTripCompleted
            ? { backgroundColor: "#eaf5ee" }
            : { backgroundColor: "#f0f1ff" },
        ]}
      >
        {isTripCompleted ? <CompletedStatusChip /> : <PlannedStatusChip />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f1ff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  text: { fontSize: 12, fontWeight: "600" },
  centeredText: { textAlign: "center" },
});
