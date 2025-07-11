import { useState, useEffect, useCallback } from "react";
import { CatchEntry, RootStackParamList } from "../../../types";
import { deleteCatchLogById } from "../api/deleteCatchLogById";
// import { addNewCatchToTrip } from "../api/addNewCatchToTrip";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCatchListForTrip } from "../api/getCatchListForTrip";
import { addNewCatchLog } from "../api/addNewCatchLog";

export default function useCatchList(tripId: number | null) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [catches, setCatches] = useState<CatchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCatches = useCallback(async () => {
    setIsLoading(true);

    if (!tripId) {
      console.error("No tripId provided");
      return;
    }

    try {
      const response = await getCatchListForTrip(tripId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setCatches(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatches();
  }, [fetchCatches]);

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

      await fetchCatches();
    } catch (error) {
      console.error("Error adding catch:", error);
      throw error;
    }
  };

  const deleteCatch = async (catchId: number) => {
    try {
      const response = await deleteCatchLogById(catchId);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setCatches((prevLogs) => prevLogs.filter((log) => log.id != catchId));
    } catch (error) {
      console.error("Error delete log:", error);
      throw error;
    }
  };

  return {
    isLoading,
    catches,
    openNewCatchForm,
    deleteCatch,
    addNewCatch,
  };
}
