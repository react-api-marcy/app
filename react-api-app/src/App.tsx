import "./App.css";
import HomeDash from "./components/HomeDash";

export default function App() {
  return (
    <div className="relative w-full pb-5 h-full">
      <div className="absolute w-full h-full sky"></div> {/* Background */}
      <div className="absolute w-full h-full backdrop-blur-lg"></div> {/* Backdrop Blur */}
      <div className="relative">
        <HomeDash /> {/* HomeDash Component */}
      </div>
    </div>
  );
}
