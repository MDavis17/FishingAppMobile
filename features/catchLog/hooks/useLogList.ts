import { useState, useEffect, useCallback } from "react";
import { CatchEntry } from "../../../types";
import { getCatchLogs } from "../api/getCatchLogs";
import { deleteCatchLogById } from "../api/deleteCatchLogById";
import { addNewCatchLog } from "../api/addNewCatchLog";

export default function useLogList() {
  const [logs, setLogs] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewCatchModalVisible, setIsNewCatchModalVisible] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getCatchLogs();
      setLogs(response);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addNewCatch = async (newCatch: CatchEntry) => {
    if (!newCatch.species || !newCatch.dateTime) {
      return;
    }

    try {
      const response = await addNewCatchLog(newCatch);

      if (!response.entry) {
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
      await deleteCatchLogById(catchId);

      // need some error handling

      setLogs((prevLogs) => prevLogs.filter((log) => log.id != catchId));
    } catch (error) {
      console.error("Error delete log:", error);
      throw error;
    }
  };

  return {
    isLoading,
    logs,
    isNewCatchModalVisible,
    setIsNewCatchModalVisible,
    addNewCatch,
    deleteCatch,
  };
}
