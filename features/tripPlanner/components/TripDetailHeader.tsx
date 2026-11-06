import { format } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { Trip } from "types";
import TripStatusChip from "./TripStatusChip";

interface Props {
  status: Trip["status"];
  title: string;
  date: string;
  tripType?: string;
}

export default function TripDetailHeader({
  status,
  title,
  date,
  tripType = "Surf Fishing",
}: Props) {
  const theme = useTheme();
  const tripDate = new Date(date);
  const formattedDate = format(tripDate, "MMM d, yyyy");
  const formattedStartTime = format(tripDate, "h:mm aaa");

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statusContainer}>
        <TripStatusChip status={status} />
        <Text variant="titleLarge">{title}</Text>
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
          <Icon source="fish" size={24} />
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
});
