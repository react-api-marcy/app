import { useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";
import {
  CurrentWeatherStats,
  ForecastResponse,
  UserLocation,
  fetchForecast,
  getCurrentWeatherStats,
  useLocation,
} from "../utils";
const mockCurrent = {
  clouds: 28,
  humidity: 86,
  icon: "/cloudy.png",
  message: "Cloudy",
  temp: 38.75,
  wind: 25.59,
};

function HomeDash() {
  const location = useLocation();
  console.log(location);
  const [forecast, setForecast] = useState<CurrentWeatherStats | undefined>();
  useEffect(() => {
    fetchForecast(location).then(getCurrentWeatherStats).then(setForecast);
  }, []);
  console.log("forecast", forecast);
  console.log(mockCurrent);
  return (
    <div className="flex z-[1000] relative pt-[5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center  h-[20rem]">
        <CurrentWeather values={forecast?.temp ? forecast : mockCurrent} />
        <Map location={location} />
        <Cities />
      </div>
      <div className="flex gap-5 w-full justify-center  h-[25rem] ">
        <Forecast />
        <WeatherGraph />
      </div>
      <div></div>
    </div>
  );
}

export default HomeDash;
