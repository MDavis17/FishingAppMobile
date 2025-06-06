import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import MapWindow from "common/components/MapWindow";
import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { RootStackParamList } from "types";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const navigation = useNavigation();

  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip } = route.params;
  const { date, waterType, location, catchList } = trip;

  useEffect(() => {
    const formattedDate = new Date(date).toLocaleDateString();
    navigation.setOptions({ title: formattedDate });
  }, [date, navigation]);

  return (
    <View style={styles.container}>
      {location && (
        <View style={styles.mapContainer}>
          <MapWindow selectedLocation={location} height={200} isViewOnly />
        </View>
      )}
      <View style={styles.flex2}>
        <View style={styles.dataContainer}>
          <Text>{waterType}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Catch List
          </Text>
          <List.Section>
            {catchList.length === 0 ? (
              <Text>No catches recorded.</Text>
            ) : (
              catchList.map((catchItem, index) => (
                <List.Item
                  key={index}
                  title={catchItem.species}
                  description={() => (
                    <View>
                      <Text>{catchItem.species}</Text>
                      {catchItem.length && (
                        <Text>Length: {catchItem.length} in</Text>
                      )}
                      {catchItem.weight && (
                        <Text>Weight: {catchItem.weight} lb</Text>
                      )}
                      <Text>
                        Time:{" "}
                        {new Date(catchItem.dateTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  )}
                  left={(props) => <List.Icon {...props} icon="fish" />}
                />
              ))
            )}
          </List.Section>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete" onPress={deleteTrip} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  mapContainer: { flex: 1 },
  flex2: { flex: 2 },
  dataContainer: { paddingTop: 8, paddingBottom: 8 },
  buttonContainer: {
    marginTop: 20,
  },
});
