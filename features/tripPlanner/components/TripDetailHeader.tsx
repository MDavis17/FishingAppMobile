import { format } from "date-fns";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { Trip, TripType } from "types";
import TripStatusChip from "./TripStatusChip";
import { TRIP_TYPE_ICONS } from "../constants";

interface Props {
  status: Trip["status"];
  title: string;
  date: string;
  tripType: TripType;
  onDelete: () => void;
}

export default function TripDetailHeader({
  status,
  title,
  date,
  tripType,
  onDelete,
}: Props) {
  const theme = useTheme();
  const tripDate = new Date(date);
  const formattedDate = format(tripDate, "MMM d, yyyy");
  const formattedStartTime = format(tripDate, "h:mm aaa");

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statusContainer}>
        <View style={styles.topRow}>
          <TripStatusChip status={status} />
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete trip"
            hitSlop={8}
          >
            <Icon
              source="trash-can-outline"
              size={20}
              color={theme.colors.error}
            />
          </Pressable>
        </View>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={styles.subHeaderContainer}>
        <View style={styles.metaItem}>
          <Icon source="calendar" size={24} />
          <Text variant="bodyMedium">{formattedDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon source="clock" size={24} />
          <Text variant="bodyMedium">{formattedStartTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon source={TRIP_TYPE_ICONS[tripType as TripType]} size={24} />
          <Text variant="bodyMedium">{tripType}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  statusContainer: {
    flex: 1,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subHeaderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: { fontWeight: "bold" },
});
