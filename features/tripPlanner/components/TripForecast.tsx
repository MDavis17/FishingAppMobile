import {
  formatSwell,
  formatWind,
  getWeatherIconName,
} from "common/utils/WeatherUtils";
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
        <View style={styles.airTempContainer}>
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
        label="Swell"
        value={formatSwell(
          forecast.swell_height_ft,
          forecast.swell_period_s,
          forecast.swell_direction_deg,
        )}
        icon="waves"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  airTempContainer: {
    flex: 1,
  },
});
