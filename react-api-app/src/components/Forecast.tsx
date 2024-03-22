import { ForecastResponse, dailyStats, getWeeklyWeatherStats } from "../utils";

function Forecast({ values }: { values: ForecastResponse }) {
  const forecast : Array<dailyStats> = getWeeklyWeatherStats(values)
  return <div className="w-[20%] pl-5 pt-3    bg-opacity-15 bg-white rounded-[25px]">
    <h1 className="text-[1.1rem] font-bold pb-5   ">Forecast</h1>
    <ul className="flex flex-col gap-5">
      {forecast.map((day) => {
        return <li className="flex gap-5 ">
        
              <img  className='w-[2.1rem]' src={day.icon}></img>
     
              <h1>{day.temp}</h1>
     

      
          <h1>{day.formatedDate}</h1>



        </li>
      })}
    </ul>
  </div>;
}

export default Forecast;
