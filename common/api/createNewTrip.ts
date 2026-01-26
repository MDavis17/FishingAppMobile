import { addNewTrip } from "features/tripPlanner/api/addNewTrip";
import { Trip } from "types";

export const createNewTrip = async (newTrip: Trip) => {
  if (!newTrip.date || !newTrip.location) {
    return;
  }

  try {
    const response = await addNewTrip(newTrip);

    if (!response.ok) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};
