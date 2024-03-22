import { useEffect, useState } from "react";
import { CurrentWeatherStats } from "./CurrentWeather";
import { ForecastResponse, fetchForecastByLocation } from "../utils";

export default function Cities() {
  const cities = ["New York", "Miami", "London", "Los Angeles"];
  const [cityData, setCityData] = useState<Record<string, CurrentWeatherStats>>({});
  useEffect(() => {
    (async () => {
      for (const city of cities) {
        const res = await fetchCityForecast(city);
        if (!res) {
          continue;
        }

        setCityData({
          ...cityData,
          [city]: new CurrentWeatherStats(res.timelines.minutely[0].values),
        });
      }
    })();
  }, []);

  return (
    <div className="w-[20%] bg-white bg-opacity-15 rounded-[25px] ">
      {" "}
      <div className="w-[90%] m-5">
        <p className="text-[1.1rem] pb-5 ">Popular Cities</p>
        <ul className="flex font-light flex-col gap-3">
          {cities.map((city) => (
            <li key={city}>
              {city}
              {cityData[city] && <span> - {cityData[city].message}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function fetchCityForecast(city: string) {
  const now = Date.now();
  const name = city.toLowerCase().replace(/\s+/g, "");
  const data = localStorage.getItem(name);
  if (data) {
    const { forecast, lastFetchTime } = JSON.parse(data);
    const oneHour = 60 * 60 * 1000;
    if (now - lastFetchTime < oneHour) {
      console.log(`[cities] retrieved forecast for city (${name}) from cache`);
      return forecast as ForecastResponse;
    }
  }

  const forecast = await fetchForecastByLocation(city.toLowerCase().replace(/\s+/g, "%20"));
  if (!forecast) {
    console.log(`couldn't retrieve forecast for ${name} from API nor the cache...`);
    return;
  }

  console.log(`retrieved forecast and caching ${name}`);
  localStorage.setItem(name, JSON.stringify({ forecast, lastFetchTime: now }));
  return forecast;
}
