import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Bait } from "types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  bestBaits: Bait[];
}

export default function BestBaits({ bestBaits }: Props) {
  const theme = useTheme();
  return (
    <View>
      <View style={styles.bestBaitsContainer}>
        {bestBaits.map((bait) => (
          <View style={{ alignItems: "center" }}>
            {/* TODO: Add bait image */}
            <MaterialCommunityIcons
              name="fish"
              size={24}
              color={theme.colors.onSurface}
            />
            <Text
              key={bait.name}
              variant="bodySmall"
              style={{ color: theme.colors.onSurface }}
            >
              {bait.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bestBaitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
