import { Button, FlatList, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { WaterType } from "types";
import useLogList from "../hooks/useLogList";
import PopupModal from "common/components/PopupModal";
import AddCatchForm from "./AddCatchForm";

export default function LogList() {
  const {
    isLoading,
    logs,
    isNewCatchModalVisible,
    setIsNewCatchModalVisible,
    addNewCatch,
  } = useLogList();

  const renderItem = ({
    item,
  }: {
    item: {
      id: number;
      dateTime: string;
      species: string;
      waterType: WaterType;
    };
  }) => (
    <List.Item
      title={item.dateTime}
      description={item.species}
      left={(props) => (
        <List.Icon
          {...props}
          icon={item.waterType === WaterType.Saltwater ? "waves" : "wave"}
        />
      )}
    />
  );

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
        renderItem={renderItem}
        keyExtractor={(item) => item.dateTime}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        title="Add New Catch"
        onPress={() => setIsNewCatchModalVisible(true)}
      />
      <PopupModal
        showModal={isNewCatchModalVisible}
        setShowModal={setIsNewCatchModalVisible}
      >
        <AddCatchForm
          isNewCatchModalVisible={isNewCatchModalVisible}
          setIsNewCatchModalVisible={setIsNewCatchModalVisible}
          addNewCatch={addNewCatch}
        />
      </PopupModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  header: {
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    padding: 10,
  },
});
