import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppCtxProvider from "./AppCtx";
import NavBar from "./components/NavBar";
import Settings from "./pages/Settings";
import Home from "./pages/Home";

export default function App() {
  return (
    <AppCtxProvider>
      <NavBar />
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </AppCtxProvider>
  );
}
