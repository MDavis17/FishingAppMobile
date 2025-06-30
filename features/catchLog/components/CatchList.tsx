import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import CatchCard from "./CatchCard";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import useCatchList from "../hooks/useCatchList";

export default function CatchList() {
  const { isLoading, logs, openNewCatchForm, deleteCatch } = useCatchList();

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

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <CatchCard catchItem={item} onDelete={(id) => deleteCatch(id)} />
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
    flex: 1,
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
