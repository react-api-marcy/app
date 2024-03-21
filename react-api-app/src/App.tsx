import "./App.css";
import HomeDash from "./components/HomeDash";

function App() {
  return (
    <>
    
    
    <div className="relative w-[100vw] h-[100vh]">
        <div className="absolute w-full h-full sky"></div> {/* Background */}
        <div className="absolute w-full h-full backdrop-blur-lg"></div> {/* Backdrop Blur */}
        <div className="relative">
          <HomeDash /> {/* HomeDash Component */}
        </div>
      </div>
    </>
    
  );
}

export default App;
