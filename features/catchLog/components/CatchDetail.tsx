import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "types";

type CatchDetailRouteProp = RouteProp<RootStackParamList, "CatchDetail">;

export default function CatchDetail() {
  const navigation = useNavigation();

  const route = useRoute<CatchDetailRouteProp>();
  const { catchItem } = route.params;

  useEffect(() => {
    const formattedDate = new Date(catchItem.dateTime).toLocaleDateString();
    navigation.setOptions({ title: formattedDate });
  }, [catchItem, navigation]);

  return (
    <View style={styles.container}>
      <Text>Species: {catchItem.species}</Text>
      <Text>Length: {catchItem.length} in</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
