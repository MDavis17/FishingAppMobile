import { useState, useEffect, useCallback } from "react";
import { CatchEntry, RootStackParamList } from "../../../types";
import { getCatchLogs } from "../api/getCatchLogs";
import { deleteCatchLogById } from "../api/deleteCatchLogById";
import { addNewCatchLog } from "../api/addNewCatchLog";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function useCatchList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [logs, setLogs] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getCatchLogs();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const openNewCatchForm = () => {
    navigation.navigate("AddNewCatch", { addNewCatch });
  };

  const addNewCatch = async (newCatch: CatchEntry) => {
    if (!newCatch.species || !newCatch.dateTime) {
      return;
    }

    try {
      const response = await addNewCatchLog(newCatch);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      await fetchLogs();
    } catch (error) {
      console.error("Error creating log:", error);
      throw error;
    }
  };

  const deleteCatch = async (catchId: number) => {
    try {
      const response = await deleteCatchLogById(catchId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setLogs((prevLogs) => prevLogs.filter((log) => log.id != catchId));
    } catch (error) {
      console.error("Error delete log:", error);
      throw error;
    }
  };

  return {
    isLoading,
    logs,
    openNewCatchForm,
    deleteCatch,
  };
}
