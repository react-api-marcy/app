import { useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";
import { ForecastResponse, fetchForecast, useLocation } from "../utils";

function HomeDash() {
  const location = useLocation();
  const [forecast, setForecast] = useState<ForecastResponse | undefined>();
  useEffect(() => {
    fetchForecast(location).then(setForecast);
  }, [location]);

  return (
    <div className="flex pt-[5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center  h-[20rem]">
        <CurrentWeather values={forecast?.timelines?.minutely?.[0]?.values} />
        <Map />
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
