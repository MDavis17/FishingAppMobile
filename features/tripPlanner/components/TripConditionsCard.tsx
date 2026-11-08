import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Card from "common/components/Card";

export default function TripConditionsCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Conditions
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 4, fontWeight: "bold" },
  card: { flex: 1 },
});
