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
  const { species, length, weight, dateTime } = catchItem;

  const mockWeatherData = {
    airTemp: 72,
    units: "F",
    waterTemp: 63,
    tideLevelAtCatchTime: 0.25,
    tideDirection: "incoming",
  };

  const { airTemp, units, waterTemp, tideLevelAtCatchTime, tideDirection } =
    mockWeatherData;

  const mockLocationData = { name: "San Diego, California" };
  const { name } = mockLocationData;

  useEffect(() => {
    const formattedDate = new Date(dateTime).toLocaleDateString();
    navigation.setOptions({ title: formattedDate });
  }, [dateTime, navigation]);

  const hasMeasurements = length || weight;

  return (
    <View style={styles.container}>
      <Text>{species}</Text>
      {hasMeasurements && (
        <View>
          {length && <Text>Length: {length} in</Text>}
          {weight && <Text>Weight: {weight} lb</Text>}
        </View>
      )}

      <View>
        <View style={styles.dataContainer}>
          <Text>{name}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text>Weather</Text>
          <Text>{`Air Temperature: ${airTemp}° ${units}`}</Text>
          <Text>{`Water Temperature: ${waterTemp}° ${units}`}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text>Tides</Text>
          <Text>{`At Catch Time: ${tideLevelAtCatchTime}`}</Text>
          <Text>{`Tide Direction: ${tideDirection}`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  dataContainer: { paddingTop: 8, paddingBottom: 8 },
});
