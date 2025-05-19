import { useState, useEffect } from "react";
import { CatchEntry, WaterType } from "../../../types";

export default function useLogList() {
  const [logs, setLogs] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewCatchModalVisible, setIsNewCatchModalVisible] = useState(false);

  const addNewCatch = (newCatch: CatchEntry) => {
    if (!newCatch.species || !newCatch.dateTime) {
      return;
    }
    setLogs((prevLogs) => [...prevLogs, newCatch]);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const mockedData: CatchEntry[] = [];
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLogs(mockedData);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return {
    isLoading,
    logs,
    isNewCatchModalVisible,
    setIsNewCatchModalVisible,
    addNewCatch,
  };
}
