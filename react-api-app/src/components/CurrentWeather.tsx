import { CurrentWeatherStats, Values } from "../utils";

export default function CurrentWeather({ values }: { values: CurrentWeatherStats }) {
  let now = new Date();
  let formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="w-[20%] flex  justify-center bg-black bg-opacity-15 backdrop-blur-lg rounded-[25px] ">
      <div className=" ">
        <div className="pl-3">
          <h1 className="text-[1.1rem] pt-5 ">Current Weather</h1>
          <h1 className="font-thin">{formattedTime}</h1>
        </div>

        <div className="flex gap-2 ">
          <img src={values.icon} width={130}></img>
          <div className="">
            <div className="flex">
              <h1 className="text-[4.3rem] font-bold">{Math.floor(values.temp)}</h1>
              <span className=" translate-y-[1.2rem] text-[1rem]">°F</span>
            </div>

            <h1 className="text-center">{values.message}</h1>
          </div>
        </div>
        <div  className="flex ">
          <img src="/drop.png"></img>
          <img src="/cloud.png"></img>
          <img src="/wind.png"></img>
        </div>
      </div>
    </div>
  );
}
