import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  LabelList,
  LabelProps
} from "recharts";

// Sample data
const data = [
  { time: "Now", temperature: 20},
  { time: "7 PM", temperature: 22},
  { time: "9 PM", temperature: 19},
  { time: "11 PM", temperature: 21},
  // Add more data points as necessary
];

const CustomTooltip = ({ active, payload, label } : TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: "#ffff", padding: "5px", border: "1px solid #cccccc" }}
      >
        <p>{`${label} : ${payload[0].value}°C`}</p>
        <p>Rain: {`${payload[1].value}%`}</p>
      </div>
    );
  }

  return null;
};
const renderCustomizedLabel: React.FC<LabelProps> = (props) => {
  const { x, y, value } = props;
  // Check if x, y, and value are defined to satisfy TypeScript checks
  if (x === undefined || y === undefined || value === undefined) return null;
  
  return <text x={x} y={y} dy={-10} fill="white" fontSize={13} textAnchor="middle">{`${value}°C`}</text>;
};
function WeatherGraph() {
  return (
    <div className="w-[61.5%] pb-3  bg-opacity-15 bg-white  rounded-[25px]">
       <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}    margin={{ top: 50, right: 0, left: 0, bottom: 0 }}>
        <defs>
        <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(130, 202, 157, 0.2)"/> 
        <stop offset="30%" stopColor="rgba(130, 202, 157, 0.1)"/> 
        <stop offset="60%" stopColor="rgba(130, 202, 157, 0)"/> 
    </linearGradient>
        </defs>
        <XAxis padding={{ right: 50, left: 50,}}  dataKey="time" tick={{ fill: 'white' }} />
       
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="temperature" stroke="rgba(130, 202, 157, 0.2)" fillOpacity={1} fill="url(#tempColor)">
          <LabelList   dataKey="temperature" content={renderCustomizedLabel} position="top" style={{ fill: 'white' }} />
        </Area>
        
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
}

export default WeatherGraph;
