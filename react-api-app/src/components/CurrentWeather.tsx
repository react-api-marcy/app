import { Values } from "../utils";

export default function CurrentWeather({ values }: { values?: Values }) {
  return (
    <div className="w-[20%] rounded-[25px] border">
      {values && <h1>{values.temperature}</h1>}
    </div>
  );
}
