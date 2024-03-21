import { useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map, { PreciseLoc } from "./Map";
import WeatherGraph from "./WeatherGraph";
import mockForecast from './mockForecast.json'
import {
  ForecastResponse,
  fetchForecast,
  useLocation,
} from "../utils";

function HomeDash() {
  const location = useLocation();
  console.log(location);
  const [forecast, setForecast] = useState<ForecastResponse | undefined>();
  useEffect(() => {
    fetchForecast(location).then(setForecast);
  }, []);
  console.log("forecast", forecast);

  return (
    <div className="flex z-[1000] relative pt-[5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center  h-[20rem]">
        <CurrentWeather values={(forecast || mockForecast) as ForecastResponse } />
        <Map location={location as PreciseLoc} />
        <Cities />
      </div>
      <div className="flex gap-5 w-full justify-center  h-[25rem] ">
        <Forecast values={(forecast || mockForecast) as ForecastResponse} />
        <WeatherGraph />
      </div>
      <div></div>
    </div>
  );
}

export default HomeDash;
