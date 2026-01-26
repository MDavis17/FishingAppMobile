export const getWeatherIconName = (weatherCondition: string): string => {
  switch (weatherCondition.toLowerCase()) {
    case "sunny":
      return "weather-sunny";
    default:
      return "weather-partly-cloudy";
  }
};
