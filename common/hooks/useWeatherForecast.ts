import { useState, useEffect } from "react";
import { getWeatherForecast } from "common/api/getWeatherForecast";
import { ForecastDay, Location } from "types";

export default function useWeatherForecast(
  tripLocation: Location,
  date: string
) {
  const [forecastDay, setForecastDay] = useState<ForecastDay>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      setIsLoading(true);
      try {
        const response = await getWeatherForecast(tripLocation.coordinates.latitude, tripLocation.coordinates.longitude);

        if (response.ok) {
          const [tripMonth, tripDay, tripYear] = new Date(date).toLocaleDateString().split('/');
          const forecastDay = response.data.forecastDays.find((day: ForecastDay) => day.displayDate.day === parseInt(tripDay) && day.displayDate.month === parseInt(tripMonth) && day.displayDate.year === parseInt(tripYear));
          setForecastDay(forecastDay);
          setHasData(!!forecastDay);
        }
      } catch (err) {
        console.error("Error fetching weather forecast:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchWeatherForecast, 300);
    return () => {
      clearTimeout(debounce);
    };
  }, []);

  return {
    forecastDay,
    isLoading,
    hasData
  };
}
