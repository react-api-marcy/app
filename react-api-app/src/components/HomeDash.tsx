import { useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";
import { CurrentWeatherStats, ForecastResponse, UserLocation, fetchForecast, reverseGeocode, useLocation } from "../utils";

const mockCurrent = {
  clouds: 28,
  humidity: 86,
  icon: "/cloudy.png",
  message: "Cloudy",
  temp: 38.75,
  wind: 25.59,
};

export default function HomeDash() {
  const location = useLocation();
  const [forecast, setForecast] = useState<CurrentWeatherStats | undefined>();

  useEffect(() => {
    (async () => {
      const forecast = await cachedFetchForecast(location);
      const timeline = forecast?.timelines?.minutely?.[0];
      if (!timeline) {
        return;
      }

      setForecast(new CurrentWeatherStats(timeline));
    })();
  }, []);

  // console.log(location);
  // console.log("forecast", forecast);

  return (
    <div className="flex z-[1000] relative pt-[5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center h-[20rem]">
        <CurrentWeather values={forecast?.temp ? forecast : mockCurrent} />
        <Map location={location} />
        <Cities />
      </div>
      <div className="flex gap-5 w-full justify-center h-[25rem] ">
        <Forecast />
        <WeatherGraph />
      </div>
      <div></div>
    </div>
  );
}

async function cachedFetchForecast(loc: UserLocation) {
  const geocoded = await reverseGeocode(loc);
  const now = Date.now();
  const name = geocoded?.[0]?.name;
  if (name) {
    const data = localStorage.getItem(name);
    console.log(`geocoded position for ${loc}: ${name}`);
    if (data) {
      const {forecast, lastFetchTime} = JSON.parse(data);
      const twentyMinutes = 20 * 60 * 1000;
      if (now - lastFetchTime < twentyMinutes) {
        console.log(`retrieved forecast for ${loc} (${name}) from cache`);
        return forecast as ForecastResponse;
      }
    }
  }

  const forecast = await fetchForecast(loc);
  if (!forecast) {
    console.log("couldn't retrieve forecast from API nor the cache...");
    return;
  }

  if (name) {
    console.log(`retrieved forecast from API for ${loc}, caching as ${name}`);
    localStorage.setItem(name, JSON.stringify({forecast, lastFetchTime: now}))
  } else {
    console.log(`retrieved forecast from API for ${loc}, not caching`);
  }
  return forecast;
}
