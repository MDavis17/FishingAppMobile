import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const MONTH_NAMES = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

interface Props {
  bestMonths: number[];
}

export default function TargetMonths({ bestMonths }: Props) {
  const theme = useTheme();
  return (
    <View>
      <View
        style={[
          styles.monthRangeBlock,
          { backgroundColor: theme.colors.primary },
        ]}
      />
      <View style={styles.bestMonthsContainer}>
        {bestMonths.map((month) => (
          <Text
            key={month}
            variant="bodySmall"
            style={{ color: theme.colors.onSurface }}
          >
            {MONTH_NAMES[month as keyof typeof MONTH_NAMES]}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bestMonthsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthRangeBlock: {
    height: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 4,
  },
});
