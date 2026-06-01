import { unauthenticatedFetch } from "./request";

export const getMarineWeather = async (lat: number, lng: number) => {
  return await unauthenticatedFetch(
    `marine/weather?latitude=${lat}&longitude=${lng}`
  );
};
