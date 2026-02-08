import useWeatherForecast from "common/hooks/useWeatherForecast";
import { ActivityIndicator, Image, View } from "react-native";
import { Text } from "react-native-paper";
import { Location } from "types";

interface Props {
    location: Location,
    date: string
}

export default function TripWeather({ location, date}: Props) {
    const {isLoading: isWeatherLoading, forecastDay, hasData} = useWeatherForecast(location, date);
    
    if(isWeatherLoading ) {
        return <ActivityIndicator />
    }

    if(!isWeatherLoading && !hasData) {
        return <Text>no forecast for date</Text>
    }

    return (
        <View>
            <Text variant="titleMedium">Weather</Text>
            <Text>{forecastDay?.displayDate.day}/{forecastDay?.displayDate.month}/{forecastDay?.displayDate.year}</Text>
            <Text>{forecastDay?.daytimeForecast.weatherCondition.description.text}</Text>
        </View>
    )
}