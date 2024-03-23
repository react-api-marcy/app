import { useContext, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { AppCtx, DefaultLocation } from "./AppCtx";

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
  cloudCoverAvg: number;
  humidity: number;
  temperatureApparentMax: number;
  temperatureApparentMin: number;
  rainAccumulationSum: number;
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

export const fetchForecastByLocation = (loc: string) => {
  const url = new URL(`${TOMORROW_BASE}/forecast?location=${loc}`);
  url.searchParams.set("apikey", TOMORROW_KEY);
  url.searchParams.set("units", "imperial");
  return fetchJson<ForecastResponse>(url);
};

export const fetchForecast = (loc: UserLocation) => {
  return fetchForecastByLocation(`${loc.lat},${loc.lon}`);
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

export const CITY_COORDS: Record<DefaultLocation, UserLocation> = {
  "New York": new UserLocation(40.7484, -73.862),
  'London': new UserLocation(51.507222, -0.1275),
  "Los Angeles": new UserLocation(34.05, -118.25),
  'Miami': new UserLocation(25.78, -80.21),
};

export const useLocation = () => {
  const { useCurrentLocation, defaultLocation } = useContext(AppCtx);
  const [location, setLocation] = useState(CITY_COORDS[defaultLocation]);
  const [coords, setCoords] = useState<UserLocation | undefined>(undefined);
  useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    watchLocationPermissionChange: true,
    onSuccess: ({ coords }) => {
      if (!useCurrentLocation) {
        setLocation(CITY_COORDS[defaultLocation]);
        return;
      }

      console.log("got location from browser");
      const loc = new UserLocation(coords.latitude, coords.longitude);
      setLocation(loc);
      setCoords(loc);
    },
    onError: (_err) => {
      if (!useCurrentLocation) {
        setLocation(CITY_COORDS[defaultLocation]);
        return;
      }

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
        const loc = new UserLocation(resp.lat, resp.lon);
        setLocation(loc);
        setCoords(loc);
      });
    },
  });

  useEffect(() => {
    console.log(coords);
    if (!useCurrentLocation || !coords) {
      setLocation(CITY_COORDS[defaultLocation]);
    } else {
      setLocation(coords);
    }
  }, [useCurrentLocation, defaultLocation]);
  return location;
};


export async function fetchCityForecast(city: string) {
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
    console.log(`couldn't retrieve forecast for ${name} from API nor the cache...`)
    return;
  }

  console.log(`retrieved forecast and caching ${name}`);
  localStorage.setItem(name, JSON.stringify({ forecast, lastFetchTime: now }));
  return forecast;
}