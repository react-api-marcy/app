import { useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";
import { CurrentWeatherStats, ForecastResponse, ReverseGeocodeResponse, UserLocation, fetchForecast, reverseGeocode, useLocation } from "../utils";

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

/**
 * The reverse geocoding API returns a list of place names like 'New York', 'New York County', 
 * 'New York City' in an inconsistent order. This function attempts to consistently pick a name
 * in order to avoid duplicate cache results. It prefers names that are already in the cache, then
 * state names, local english names, and then finally the generic 'name'.
 */
function findBestLocation(resp?: ReverseGeocodeResponse) {
  if (!resp || !resp.length) {
    return;
  }

  let preferred;
  for (const {name, state, local_names} of resp) {
    if (localStorage.getItem(name)) {
      return name;
    } else if (state && localStorage.getItem(state)) {
      return state;
    } else if (local_names.en && localStorage.getItem(local_names.en)) {
      return local_names.en;
    }

    if (!preferred) {
      if (state) {
        preferred = state;
      } else if (local_names.en) {
        preferred = local_names.en;
      } else {
        preferred = name;
      }
    }
  }

  return preferred;
}

async function cachedFetchForecast(loc: UserLocation) {
  const now = Date.now();
  const name = findBestLocation(await reverseGeocode(loc));
  if (name) {
    const data = localStorage.getItem(name);
    console.log(`geocoded position for ${loc} (${name})`);
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
    console.log(`couldn't retrieve forecast for ${loc} (${name}) from API nor the cache...`);
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
