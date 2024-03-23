import { useContext, useEffect, useState } from "react";
import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";
import mockForecast from "../../data/mockForecast.json";
import {
  ForecastResponse,
  ReverseGeocodeResponse,
  Coords,
  fetchCityForecast,
  fetchForecast,
  reverseGeocode,
  useLocation,
  CITY_COORDS,
} from "../utils";
import { AppCtx, DefaultLocation } from "../AppCtx";

export default function HomeDash() {
  const location = useLocation();
  const { useCurrentLocation } = useContext(AppCtx);
  const [forecast, setForecast] = useState(mockForecast as unknown as ForecastResponse);
  useEffect(() => {
    (async () => {
      let forecast;
      if ((location as any) in CITY_COORDS || !useCurrentLocation) {
        forecast = await fetchCityForecast(
          (Object.keys(CITY_COORDS) as DefaultLocation[]).find(
            (key) => CITY_COORDS[key] === location
          )!
        );
      } else {
        forecast = await fetchLocForecast(location as Coords);
      }

      if (!forecast) {
        return;
      }

      setForecast(forecast);
    })();
  }, []);

  return (
    <div className="flex z-[1000] relative pt-[5.5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center h-[20rem]">
        <CurrentWeather values={forecast.timelines.minutely[0].values} />
        <Map location={location} />
        <Cities />
      </div>
      <div className="flex gap-5 w-full justify-center h-[25rem] ">
        <Forecast daily={forecast.timelines.daily} />
        <WeatherGraph hourly={forecast.timelines.hourly} />
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
  for (const { name, state, local_names } of resp) {
    if (localStorage.getItem(name)) {
      preferred = name;
      break;
    } else if (state && localStorage.getItem(state)) {
      preferred = state;
      break;
    } else if (local_names.en && localStorage.getItem(local_names.en)) {
      preferred = local_names.en;
      break;
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

  return preferred!.toLowerCase().replace(/\s+/g, "");
}

async function fetchLocForecast(loc: Coords) {
  const now = Date.now();
  const name = findBestLocation(await reverseGeocode(loc));
  if (name) {
    console.log(`geocoded position for ${loc} (${name})`);
    const data = localStorage.getItem(name);
    if (data) {
      const { forecast, lastFetchTime } = JSON.parse(data);
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
    localStorage.setItem(name, JSON.stringify({ forecast, lastFetchTime: now }));
  } else {
    console.log(`retrieved forecast from API for ${loc}, not caching`);
  }
  return forecast;
}
