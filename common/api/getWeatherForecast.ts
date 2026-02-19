import { googleWeatherFetch } from "./request";

export const getWeatherForecast = async (lat: number, lng: number, days = 1) => {
  const queryString = `location.latitude=${lat}&location.longitude=${lng}&days=${days}`;
  return await googleWeatherFetch(`forecast/days:lookup`, queryString);
};
