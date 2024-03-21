import { DailyWeatherStats, Timeline } from "../utils";

function Forecast({ daily }: { daily: Timeline[] }) {
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

export default Forecast;
