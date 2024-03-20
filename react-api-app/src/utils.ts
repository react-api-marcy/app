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

export const fetchForecast = async (loc: UserLocation) => {
  const location =
    loc.kind === "precise" ? `${loc.lat},${loc.lon}` : `${loc.zip}%20${loc.countryCode}`;
  // UrlSearchParams::set encodes spaces using '+', but tomorrow's api expects %20, so encode
  // manually
  const url = new URL(`${API_BASE}/forecast?location=${location}&apikey=${API_KEY}&units=imperial`);
  return await fetchJson<ForecastResponse>(url);
};

type LocationResponse = {
  status: "success" | "fail";
  message: string;
  countryCode?: string;
  zip?: string;
  lat?: number;
  lon?: number;
};

export type UserLocation =
  | { kind: "precise"; lat: number; lon: number }
  | { kind: "weak"; zip: string; countryCode: string };

export const useLocation = () => {
  const [location, setLocation] = useState<UserLocation>({
    kind: "weak",
    countryCode: "US",
    zip: "11232",
  });
  useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
    watchLocationPermissionChange: true,
    onSuccess: ({ coords }) => {
      console.log("got location from browser");
      setLocation({ kind: "precise", lat: coords.latitude, lon: coords.longitude });
    },
    onError: (err) => {
      console.warn("couldn't get geolocation, attempting fallback");

      const url = new URL("http://ip-api.com/json/?fields=status,message,countryCode,zip,lat,lon");
      fetchJson<LocationResponse>(url, { cache: "force-cache" }).then((resp) => {
        if (!resp || resp.status !== "success") {
          return console.warn(`couldn't get fallback geolocation: ${resp?.message}`);
        }

        console.log(`got fallback location: ${resp}`);
        if (resp?.lat && resp?.lon) {
          setLocation({ kind: "precise", lat: resp.lat, lon: resp.lon });
        } else {
          setLocation({ kind: "weak", zip: resp?.zip!, countryCode: resp?.countryCode! });
        }
      });
    },
  });

  return location;
};
