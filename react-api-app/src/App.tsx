import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomeDash from "./components/HomeDash";
import AppCtxProvider from "./AppCtx";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";

export default function App() {
  return (
    <AppCtxProvider>
      <div className="relative w-full pb-5 h-full">
        <div className="absolute w-full h-full sky"></div> {/* Background */}
        <div className="absolute w-full h-full backdrop-blur-lg"></div> {/* Backdrop Blur */}
        <div className="relative">
          <NavBar />
          <HomeDash />
        </div>
        <Routes>
          <Route path="/settings" element={<Settings />} />
          <Route path="/" />
        </Routes>
      </div>
    </AppCtxProvider>
  );
}
