import { useState } from "react";
import { useGeolocated } from "react-geolocated";

const API_KEY = import.meta.env.VITE_TOMORROW_KEY;
const API_BASE = "https://api.tomorrow.io/v4/weather";

export const fetchJson = async <T>(url: RequestInfo | URL, init?: RequestInit) => {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      throw new Error(`'${url}' responded with error code ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(err);
    return;
  }
};

export type Values = {
  temperature: number;
  temperatureApparent: number;
  precipitationProbability: number;
  rainIntensity: number;
  sleetIntesity: number;
  snowIntensity: number;
  windSpeed: number;
  cloudCover: number;
  humidity: number;
};

export type Timeline = {
  time: string;
  values: Values;
};

export type ForecastResponse = {
  timelines: {
    minutely: Timeline[];
    hourly: Timeline[];
    daily: Timeline[];
  };
};

export const fetchForecast = async (loc: UserLocation): Promise<ForecastResponse | undefined> => {
  const cachedData = localStorage.getItem("forecast");
  const lastFetchTime = localStorage.getItem("last_fetch_time");

  const currentTime = new Date().getTime();
  const twentyMinutes = 20 * 60 * 1000;

  if (cachedData && lastFetchTime) {
    const timeSinceLastFetch = currentTime - parseInt(lastFetchTime, 10);
    if (timeSinceLastFetch < twentyMinutes) {
      console.log("retrieved forecast from cache");
      return JSON.parse(cachedData) as ForecastResponse;
    }
  }

  const url = new URL(`${API_BASE}/forecast?location=${loc.lat},${loc.lon}`);
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("units", "imperial");

  const forecast = await fetchJson<ForecastResponse>(url);
  localStorage.setItem("weatherData", JSON.stringify(forecast)); // Convert object to string for storage
  localStorage.setItem("lastFetchTime", currentTime.toString());
  console.log("retrieved forecast from API");
  return forecast;
};

type LocationResponse = {
  status: "success" | "fail";
  message: string;
  lat?: number;
  lon?: number;
};

export type UserLocation = { lat: number; lon: number };

export const useLocation = () => {
  const [location, setLocation] = useState<UserLocation>({
    lat: 40.7484,
    lon: -73.862,
  });
  useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    watchLocationPermissionChange: true,
    onSuccess: ({ coords }) => {
      console.log("got location from browser");
      setLocation({ lat: coords.latitude, lon: coords.longitude });
    },
    onError: (_err) => {
      console.warn("couldn't get geolocation, attempting fallback");

      const url = new URL("http://ip-api.com/json/?fields=status,message,lat,lon");
      fetchJson<LocationResponse>(url, { cache: "force-cache" }).then((resp) => {
        if (
          !resp ||
          resp.status !== "success" ||
          resp.lon === undefined ||
          resp.lat === undefined
        ) {
          return console.warn(`couldn't get fallback geolocation: ${resp?.message}`);
        }

        console.log(`got fallback location from IP: ${resp}`);
        setLocation({ lat: resp.lat, lon: resp.lon });
      });
    },
  });

  return location;
};

export class CurrentWeatherStats {
  temp: number;
  clouds: number;
  wind: number;
  humidity: number;
  icon: string;
  message: string;

  constructor(timeline: Timeline) {
    const {cloudCover: clouds, rainIntensity} = timeline.values;
    if (rainIntensity > 0) {
      this.icon = "/rainy-day.png";
      if (rainIntensity < 10) {
        this.message = "Light Rain";
      } else if (rainIntensity > 30) {
        this.message = "Moderate Rain";
      } else {
        this.message = "Heavy Rain";
      }
    } else if (clouds < 20) {
      this.icon = "/sunny.png";
      this.message = "Mostly Sunny";
    } else {
      this.icon = "/cloudy.png";
      this.message = "Cloudy";
    }
    this.temp = timeline.values.temperature;
    this.clouds = clouds;
    this.wind = timeline.values.windSpeed;
    this.humidity = timeline.values.humidity;
  }
}
