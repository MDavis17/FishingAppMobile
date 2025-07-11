import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
// import CatchCard from "./CatchCard";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import useCatchList from "../hooks/useCatchList";
// import { addNewCatchToTrip } from "../api/addNewCatchToTrip";

interface Props {
  tripId: number;
}

export default function CatchList({ tripId }: Props) {
  const { isLoading, catches, openNewCatchForm } = useCatchList(tripId);

  const renderSkeletonItem = (_: any, index: number) => (
    <View key={index} style={styles.skeletonItem}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonText} />
        <View style={[styles.skeletonText, styles.skeletonTextShort]} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.loadingText}>
          Loading...
        </Text>
        {Array.from({ length: 5 }).map(renderSkeletonItem)}
      </View>
    );
  }

  // const mockAddNewCatch = async () => {
  //   const newCatch = {
  //     dateTime: "2023-10-26 15:30:00",
  //     species: "Halibut",
  //     waterType: "Saltwater",
  //   };

  //   try {
  //     const response = await addNewCatchToTrip(tripId, newCatch);

  //     if (!response.ok) {
  //       throw new Error("Something went wrong");
  //     }

  //     // await fetchLogs();
  //   } catch (error) {
  //     console.error("Error creating log:", error);
  //     throw error;
  //   }
  // };

  return (
    <View style={styles.container}>
      <FlatList
        data={catches}
        renderItem={({ item }) => (
          // <CatchCard catchItem={item} onDelete={(id) => deleteCatch(id)} />
          <Text>{item.species}</Text>
        )}
        keyExtractor={(item) => item.dateTime}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
      <SecondaryButton onPress={() => openNewCatchForm()}>
        Add New Catch
      </SecondaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 8,
  },
  loadingText: {
    marginBottom: 20,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "90%",
    alignSelf: "center",
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    height: 15,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
    borderRadius: 5,
  },
  skeletonTextShort: {
    width: "60%",
  },
  listContainer: {
    padding: 10,
  },
});
