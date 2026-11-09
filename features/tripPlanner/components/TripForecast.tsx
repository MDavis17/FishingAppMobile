import { getWeatherIconName, formatWind } from "common/utils/WeatherUtils";
import TripCondition from "features/tripPlanner/components/TripCondition";
import { StyleSheet, View } from "react-native";
import { TripForecast as TripForecastType } from "common/api/getTripForecast";

interface Props {
  forecast: TripForecastType;
}

export default function TripForecast({ forecast }: Props) {
  return (
    <View style={styles.container}>
      {forecast.air_temp_f !== null && (
        <View>
          {forecast.weather_description && (
            <TripCondition
              label={forecast.weather_description}
              value={`${Math.round(forecast.air_temp_f)}°F`}
              icon={getWeatherIconName(forecast.weather_description ?? "")}
            />
          )}
        </View>
      )}

      <TripCondition
        label="Water"
        value={
          forecast.water_temp_f !== null
            ? `${Math.round(forecast.water_temp_f)}°F`
            : "—"
        }
        icon="thermometer"
      />
      <TripCondition
        label="Wind"
        value={formatWind(forecast.wind_speed_mph, forecast.wind_direction_deg)}
        icon="weather-windy"
      />
      <TripCondition
        label="Pressure"
        value={
          forecast.pressure_inhg !== null
            ? `${forecast.pressure_inhg.toFixed(2)} inHg`
            : "—"
        }
        icon="gauge"
      />
      <TripCondition
        label="Surf"
        value={
          forecast.surf_height_ft !== null
            ? `${forecast.surf_height_ft.toFixed(1)} ft`
            : "—"
        }
        icon="wave"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
});
