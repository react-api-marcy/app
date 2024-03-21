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
  const cachedData = localStorage.getItem('forecast')
  const lastFetchTime = localStorage.getItem('last_fetch_time')

  const currentTime = new Date().getTime();
  const twentyMinutes = 20 * 60 * 1000;

  if (cachedData && lastFetchTime) {
    const timeSinceLastFetch = currentTime - parseInt(lastFetchTime, 10);
    if (timeSinceLastFetch < twentyMinutes) {
      return Promise.resolve(JSON.parse(cachedData));
    }
  }


  const location =
    loc.kind === "precise" ? `${loc.lat},${loc.lon}` : `${loc.zip}%20${loc.countryCode}`;
  // UrlSearchParams::set encodes spaces using '+', but tomorrow's api expects %20, so encode
  // manually
  const url = new URL(`${API_BASE}/forecast?location=${location}&apikey=${API_KEY}&units=imperial`);
  const forecast = await fetchJson<ForecastResponse>(url);
  localStorage.setItem('weatherData', JSON.stringify(forecast)); // Convert object to string for storage
  localStorage.setItem('lastFetchTime', currentTime.toString());
  console.log(forecast)
  return forecast
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


export interface CurrentWeatherStats {
  temp: number, clouds: number, wind: number, humidity: number, icon: string, message: string
}
export const getCurrentWeatherStats = (forecast: any) => {
  let temp = forecast?.timelines?.minutely?.[0]?.values.temperature
  let humidity = forecast?.timelines?.minutely?.[0]?.values.humidity;
  let wind = forecast?.timelines?.minutely?.[0]?.values.windSpeed
  let clouds = forecast?.timelines?.minutely?.[0]?.values.cloudCover
  let rainIntensity = forecast?.timelines?.minutely?.[0]?.values.rainIntensity

  let icon;
  let message;
  if (rainIntensity > 0) {
    icon = '/rainy-day.png'
    if (rainIntensity < 10) {
      message = 'Light Rain'
    } else if (rainIntensity > 30) {
      message = 'Moderate Rain'
    } else {
      message = 'Heavy Rain'
    }

  } else if (clouds < 20) {
    icon = '/sunny.png'
    message = 'Mostly Sunny'
  } else {
    icon = '/cloudy.png'
    message = 'Cloudy'
  }

  return { temp, clouds, wind, humidity, icon, message } as CurrentWeatherStats
}