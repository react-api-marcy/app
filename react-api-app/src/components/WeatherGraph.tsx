import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LabelProps,
} from "recharts";
import { Timeline } from "../utils";

export const getHourlyWeatherStats = (hourly: Timeline[]) => {
  return hourly.slice(0, 10).map((hour, i) => {
    const temp = Math.floor(hour.values.temperature);
    if (i === 0) {
      return { temp, time: "Now" };
    } else {
      const dateString = hour.time;
      const date = new Date(dateString);
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return { temp, time: `${hours} ${ampm}` };
    }
  });
};

const renderCustomizedLabel: React.FC<LabelProps> = (props) => {
  const { x, y, value } = props;
  if (x === undefined || y === undefined || value === undefined) return null;
  return (
    <text x={x} y={y} dy={-10} fill="white" fontSize={13} textAnchor="middle">{`${value}°C`}</text>
  );
};

export default function WeatherGraph({ hourly }: { hourly: Timeline[] }) {
  const data = getHourlyWeatherStats(hourly);
  // console.log(data);
  return (
    <div className="w-[61.5%]  pb-[5rem]  bg-opacity-15 bg-white  rounded-[25px]">
      <h1 className="pt-[2rem] pb-5  text-[1.2rem] pl-8">Summary</h1>

      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 50, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(130, 202, 157, 0.2)" />
              <stop offset="30%" stopColor="rgba(130, 202, 157, 0.1)" />
              <stop offset="60%" stopColor="rgba(130, 202, 157, 0)" />
            </linearGradient>
          </defs>
          <XAxis padding={{ right: 60, left: 60 }} dataKey="time" tick={{ fill: "white" }} />

          <Tooltip />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="rgba(130, 202, 157, 0.2)"
            fillOpacity={1}
            fill="url(#tempColor)"
          >
            <LabelList
              dataKey="temp"
              content={renderCustomizedLabel}
              position="top"
              style={{ fill: "white" }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
