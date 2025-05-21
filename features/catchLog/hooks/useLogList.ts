import { useState, useEffect } from "react";
import { CatchEntry } from "../../../types";

export default function useLogList() {
  const [logs, setLogs] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewCatchModalVisible, setIsNewCatchModalVisible] = useState(false);

  const addNewCatch = async (newCatch: CatchEntry) => {
    if (!newCatch.species || !newCatch.dateTime) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/catchLog/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCatch),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setLogs((prevLogs) => [...prevLogs, newCatch]);
    } catch (error) {
      console.error("Error creating log:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/catchLog/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setLogs(data);
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
