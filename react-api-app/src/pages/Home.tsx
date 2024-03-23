import HomeDash from "../components/HomeDash";
import { useContext } from "react";
import { AppCtx } from "../AppCtx";

export default function Home() {
  const { darkMode } = useContext(AppCtx);

  return (
    <div className="relative w-full pb-[5rem] h-full">
      <div className={`absolute w-full h-full ${darkMode ? "night" : "sky"}`}></div>{" "}
      {/* Background */}
      <div className="absolute w-full h-full backdrop-blur-lg"></div> {/* Backdrop Blur */}
      <div className="relative">
        <HomeDash />
      </div>
    </div>
  );
}
