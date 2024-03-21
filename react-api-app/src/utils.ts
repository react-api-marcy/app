import { useState } from "react";
import { useGeolocated } from "react-geolocated";

const TOMORROW_KEY = import.meta.env.VITE_TOMORROW_KEY;
const TOMORROW_BASE = "https://api.tomorrow.io/v4/weather";

const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const OPENWEATHER_BASE = "https://api.openweathermap.org/geo/1.0";

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

export const fetchForecast = (loc: UserLocation) => {
  const url = new URL(`${TOMORROW_BASE}/forecast?location=${loc.lat},${loc.lon}`);
  url.searchParams.set("apikey", TOMORROW_KEY);
  url.searchParams.set("units", "imperial");
  return fetchJson<ForecastResponse>(url);
};

export type ReverseGeocodeResponse = {
  name: string;
  country: string;
  state?: string;
  local_names: { en?: string };
}[];

export const reverseGeocode = ({ lat, lon }: UserLocation) => {
  const url = new URL(`${OPENWEATHER_BASE}/reverse?lat=${lat}&lon=${lon}`);
  url.searchParams.set("appid", OPENWEATHER_KEY);
  url.searchParams.set("limit", "1");
  // identical latitude and longitude coords will always return the same city, so cache indefinitely
  return fetchJson<ReverseGeocodeResponse>(url, { cache: "force-cache" });
};

type LocationResponse = {
  status: "success" | "fail";
  message: string;
  lat?: number;
  lon?: number;
};

export class UserLocation {
  constructor(public lat: number, public lon: number) {}

  toString() {
    return `latitude=${this.lat}, longitude=${this.lon}`;
  }
}

export const useLocation = () => {
  const [location, setLocation] = useState(new UserLocation(40.7484, -73.862));
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
      fetchJson<LocationResponse>(url).then((resp) => {
        if (
          !resp ||
          resp.status !== "success" ||
          resp.lon === undefined ||
          resp.lat === undefined
        ) {
          return console.warn(`couldn't get fallback geolocation: ${resp?.message}`);
        }

        console.log(`got fallback location from IP:`, resp);
        setLocation(new UserLocation(resp.lat, resp.lon));
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
    const { cloudCover: clouds, rainIntensity } = timeline.values;
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
