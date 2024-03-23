import { useContext } from "react";
import { Timeline } from "../utils";
import { AppCtx } from "../AppCtx";

class DailyWeatherStats {
  formattedDate: string;
  temp: string;
  icon: string;

  constructor({ time, values }: Timeline) {
    const date = new Date(time);
    const month = date.toLocaleString("default", { month: "long" });
    const numDay = date.getDate(); // 21, for example
    const weekday = date.toLocaleString("default", { weekday: "short" });
    this.formattedDate = `${weekday}, ${month} ${numDay}`;

    const high = values.temperatureApparentMax;
    const low = values.temperatureApparentMin;
    this.temp = `${Math.floor(high)}°/${Math.floor(low)}°`;
    if (values.rainAccumulationSum > 0) {
      this.icon = "/rainy-day.png";
    } else if (values.cloudCoverAvg < 20) {
      this.icon = "/sunny.png";
    } else {
      this.icon = "/cloudy.png";
    }
  }
}

export default function Forecast({ daily }: { daily: Timeline[] }) {
  const { darkMode } = useContext(AppCtx);
  const forecast = daily.map((timeline) => new DailyWeatherStats(timeline));
  return (
    <div
      className={`w-[20%] pl-5 pt-3 bg-opacity-15 ${
        darkMode ? "bg-black" : "bg-white"
      } rounded-[25px]`}
    >
      <h1 className="text-[1.1rem] font-bold pb-5">Forecast</h1>
      <ul className="flex flex-col gap-5">
        {forecast.map((day) => {
          return (
            <li className="flex gap-5" key={day.formattedDate}>
              <img className="w-[2.1rem]" src={day.icon}></img>
              <h1>{day.temp}</h1>
              <h1>{day.formattedDate}</h1>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
