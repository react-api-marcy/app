import Cities from "./Cities";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import Map from "./Map";
import WeatherGraph from "./WeatherGraph";

function HomeDash() {
  return (
    <div className="flex pt-[5rem] gap-5 justify-center flex-col">
      <div className="flex gap-5 w-full justify-center  h-[20rem]">
        <CurrentWeather />
        <Map />
        <Cities />
      </div>
      <div className="flex gap-5 w-full justify-center  h-[25rem] ">
        <Forecast />
        <WeatherGraph />
      </div>
      <div></div>
    </div>
  );
}

export default HomeDash;
