import { StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { CatchEntry } from "types";

interface Props {
  catchHistory: CatchEntry[];
}

export default function CatchHistory({ catchHistory }: Props) {
  if (catchHistory.length === 0) {
    return <Text>No catch history found</Text>;
  }
  return (
    <View>
      {catchHistory.map((catchItem, index) => (
        <>
          <View key={index} style={styles.catchRowContainer}>
            <Text>{catchItem.dateTime}</Text>
            <Text>{catchItem.location?.name}</Text>
            <Text>{catchItem.bait}</Text>
          </View>
          {index < catchHistory.length - 1 && <Divider />}
        </>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bestBaitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catchRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});
