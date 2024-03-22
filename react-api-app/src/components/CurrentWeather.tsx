import { Values } from "../utils";

export class CurrentWeatherStats {
  temp: number;
  clouds: number;
  wind: number;
  humidity: number;
  icon: string;
  message: string;

  constructor(values: Values) {
    const { cloudCover: clouds, rainIntensity } = values;
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
    this.temp = values.temperature;
    this.clouds = clouds;
    this.wind = values.windSpeed;
    this.humidity = values.humidity;
  }
}

export default function CurrentWeather({ values }: { values: Values }) {
  const stats = new CurrentWeatherStats(values);
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

//   const currentWeather : CurrentWeatherStats = CurrentWeatherStats(values)
  return (
    <div className="w-[20%] flex justify-center bg-black bg-opacity-15 backdrop-blur-lg rounded-[25px] ">
      <div className=" ">
        <div className="pl-3">
          <h1 className="text-[1.1rem] pt-5 font-bold">Current Weather</h1>
          <h1 className="font-thin">{formattedTime}</h1>
        </div>

        <div className="flex pb-5">
          <img src={stats.icon} width={130}></img>
          <div className="">
            <div className="flex">
              <h1 className="text-[4.3rem] font-bold">{Math.floor(stats.temp)}</h1>
              <span className="translate-y-[1.2rem] text-[1rem]">°F</span>
            </div>

            <h1 className="text-center">{stats.message}</h1>
          </div>
        </div>
        <div className="flex text-center justify-between ">
          <div >
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/drop.png"></img>
            <h1>{stats.humidity}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/cloud.png"></img>
            <h1>{stats.clouds}</h1>
          </div>
          <div>
            <img className="w-[1.6rem] mb-1 h-[1.6rem]" src="/wind.png"></img>
            <h1>{stats.wind}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
