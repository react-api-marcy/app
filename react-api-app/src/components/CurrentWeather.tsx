import { CurrentWeatherStats } from "../utils";

export default function CurrentWeather({ values }: { values: CurrentWeatherStats }) {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="w-[20%] flex justify-center bg-black bg-opacity-15 backdrop-blur-lg rounded-[25px] ">
      <div className=" ">
        <div className="pl-3">
          <h1 className="text-[1.1rem] pt-5  font-bold">Current Weather</h1>
          <h1 className="font-thin">{formattedTime}</h1>
        </div>

        <div className="flex pb-5  ">
          <img src={values.icon} width={130}></img>
          <div className="">
            <div className="flex">
              <h1 className="text-[4.3rem] font-bold">{Math.floor(values.temp)}</h1>
              <span className=" translate-y-[1.2rem] text-[1rem]">°F</span>
            </div>

            <h1 className="text-center">{values.message}</h1>
          </div>
        </div>
        <div className="flex text-center justify-between ">
          <div >
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/drop.png"></img>
            <h1>{values.humidity}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/cloud.png"></img>
            <h1>{values.clouds}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/wind.png"></img>
            <h1>{values.wind}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
