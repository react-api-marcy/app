import { useContext, useEffect, useState } from "react";
import { CurrentWeatherStats } from "./CurrentWeather";
import { fetchCityForecast } from "../utils";
import { AppCtx } from "../AppCtx";

export const CITIES = ["New York", "Miami", "London", "Los Angeles"] as const;

export default function Cities() {
  const { darkMode } = useContext(AppCtx);
  const [cityData, setCityData] = useState<Record<string, CurrentWeatherStats>>({});
  useEffect(() => {
    (async () => {
      for (const city of CITIES) {
        const res = await fetchCityForecast(city);
        if (!res) {
          continue;
        }

        setCityData((cityData) => ({
          ...cityData,
          [city]: new CurrentWeatherStats(res.timelines.minutely[0].values),
        }));
      }
    })();
  }, []);

  return (
    <div className={`w-[20%] ${darkMode ? "bg-black" : "bg-white"} bg-opacity-15 rounded-[25px] `}>
      {" "}
      <div className="w-[90%] m-5">
        <p className="text-[1.1rem] pb-5 ">Popular Cities</p>
        <ul className="flex font-light flex-col gap-3">
          {CITIES.map((city) => (
            <li key={city}>
              {cityData[city] ? (
                <>
                  <img className="w-[2.1rem] inline" src={cityData[city].icon}></img>
                  <span className="p-2">
                    {city} - {cityData[city].message}
                  </span>
                </>
              ) : (
                <span>{city} - Loading...</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
