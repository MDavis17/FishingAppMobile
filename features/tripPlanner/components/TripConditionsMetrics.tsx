import { getWeatherIconName, formatWind } from "common/utils/WeatherUtils";
import TripCondition from "features/tripPlanner/components/TripCondition";
import { StyleSheet, View } from "react-native";
import { TripConditions } from "common/api/getTripConditions";

interface Props {
  conditions: TripConditions;
}

export default function TripConditionsMetrics({ conditions }: Props) {
  return (
    <View style={styles.container}>
      {conditions.air_temp_f !== null && (
        <View style={styles.airTempContainer}>
          {conditions.weather_description && (
            <TripCondition
              label={conditions.weather_description}
              value={`${Math.round(conditions.air_temp_f)}°F`}
              icon={getWeatherIconName(conditions.weather_description ?? "")}
            />
          )}
        </View>
      )}

      <TripCondition
        label="Water"
        value={
          conditions.water_temp_f !== null
            ? `${Math.round(conditions.water_temp_f)}°F`
            : "—"
        }
        icon="thermometer"
      />
      <TripCondition
        label="Wind"
        value={formatWind(
          conditions.wind_speed_mph,
          conditions.wind_direction_deg,
        )}
        icon="weather-windy"
      />
      <TripCondition
        label="Pressure"
        value={
          conditions.pressure_inhg !== null
            ? `${conditions.pressure_inhg.toFixed(2)} inHg`
            : "—"
        }
        icon="gauge"
      />
      <TripCondition
        label="Surf"
        value={
          conditions.surf_height_ft !== null
            ? `${conditions.surf_height_ft.toFixed(1)} ft`
            : "—"
        }
        icon="wave"
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
