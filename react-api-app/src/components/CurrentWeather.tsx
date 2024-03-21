import { CurrentWeatherStats, ForecastResponse, Values, getCurrentWeatherStats } from "../utils";

export default function CurrentWeather({ values }: { values: ForecastResponse }) {

  let now = new Date();
  let formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const currentWeather : CurrentWeatherStats = getCurrentWeatherStats(values)
  return (
    <div className="w-[20%] flex  justify-center bg-black bg-opacity-15 backdrop-blur-lg rounded-[25px] ">
      <div className=" ">
        <div className="pl-3">
          <h1 className="text-[1.1rem] pt-5  font-bold">Current Weather</h1>
          <h1 className="font-thin">{formattedTime}</h1>
        </div>

        <div className="flex pb-5  ">
          <img src={currentWeather.icon} width={130}></img>
          <div className="">
            <div className="flex">
              <h1 className="text-[4.3rem] font-bold">{Math.floor(currentWeather.temp)}</h1>
              <span className=" translate-y-[1.2rem] text-[1rem]">°F</span>
            </div>

            <h1 className="text-center">{currentWeather.message}</h1>
          </div>
        </div>
        <div className="flex text-center justify-between ">
          <div >
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/drop.png"></img>
            <h1>{currentWeather.humidity + '%'}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/cloud.png"></img>
            <h1>{currentWeather.clouds + '%'}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/wind.png"></img>
            <h1>{currentWeather.wind}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
