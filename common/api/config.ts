import { DEV_API, PROD_API } from "./constants";

type Config = {
  symbol: string | null;
  api: string;
};

// use react native config or something to manage these
export const GooglePlacesAPIKey = "AIzaSyAIFMv0a-wViRjrkAmzPwG_RuLBOPergy8";
export const GoogleWeatherAPIKey = 'AIzaSyA9k6fVkoVwCJlgwX4aGeWHmS3HlXojcbM';

export let config: Config = process.env.ENV === "LOCAL" ? DEV_API : PROD_API;
export const GooglePlacesApiBaseUrl =
  "https://maps.googleapis.com/maps/api/place/";
export const GoogleWeatherApiBaseUrl =
  "https://weather.googleapis.com/v1/";
