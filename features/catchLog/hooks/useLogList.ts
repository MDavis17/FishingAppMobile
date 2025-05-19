import { useState, useEffect } from "react";
import { CatchEntry, FisheryType } from "../../../types";

export default function useLogList() {
  const [logs, setLogs] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const mockedData: CatchEntry[] = [
          {
            id: 1,
            dateTime: "2025-05-13T10:15:37",
            species: "Rainbow Trout",
            fisheryType: FisheryType.Freshwater,
          },
          {
            id: 2,
            dateTime: "2025-05-14T14:20:00",
            species: "Halibut",
            fisheryType: FisheryType.Saltwater,
          },
        ];
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

  return { logs, isLoading };
}
