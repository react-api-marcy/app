import { Timeline } from "../utils";

export class DailyWeatherStats {
  formattedDate: string;
  temp: string;
  icon: string;

  constructor({time, values}: Timeline) {
    const date = new Date(time);
    const month = date.toLocaleString('default', { month: 'long' });
    const numDay = date.getDate(); // 21, for example
    const weekday = date.toLocaleString('default', { weekday: 'short' });
    this.formattedDate = `${numDay} ${month}, ${weekday}`

    let high = values.temperatureApparentMax
    let low = values.temperatureApparentMin
    this.temp = `${Math.floor(high)}°/${Math.floor(low)}°`
    if (values.rainAccumulationSum > 0) {
      this.icon = '/rainy-day.png'
    } else if (values.cloudCoverAvg < 20) {
      this.icon = '/sunny.png'
    } else {
      this.icon = '/cloudy.png'
    }
  }
}

export default function Forecast({ daily }: { daily: Timeline[] }) {
  const forecast = daily.map((timeline) => new DailyWeatherStats(timeline));
  return (
    <div className="w-[20%] pl-5 pt-3 bg-opacity-15 bg-white rounded-[25px]">
      <h1 className="text-[1.1rem] font-bold   ">Forecast</h1>
      <ul className="flex flex-col gap-5">
        {forecast.map((day) => {
          return (
            <li className="flex ">
              <div>
                <img className="w-[2.1rem]" src={day.icon}></img>
              </div>
              <h1>day.</h1>
              <div></div>

              <div></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
