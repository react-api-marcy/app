import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CITIES } from "../components/Cities";
import { AppCtx, DefaultLocation } from "../AppCtx";

export default function Settings() {
  const nav = useNavigate();
  const {
    darkMode,
    setDarkMode,
    defaultLocation,
    setDefaultLocation,
    useCurrentLocation,
    setUseCurrentLocation,
  } = useContext(AppCtx);

  return (
    <div
      id="default-modal"
      tabIndex={-1}
      className={` ${
        darkMode ? "bg-gray-900" : "bg-gray-700"
      } overflow-y-auto z-[3000] overflow-x-hidden  justify-center items-center w-full h-screen  flex  `}
    >
      <div className=" p-4 w-full h-full">
        <div className="    h-full w-full mt-12 ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-black  dark:text-white">Settings</h3>
            <button
              type="button"
              className="text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              onClick={() => nav("/")}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <div className="block">
              <input
                className="w-4 translate-y-[1px] h-4"
                type="checkbox"
                name="darkmode"
                id="darkmode"
                checked={darkMode}
                onChange={(e) => setDarkMode(!!e.target.checked)}
              />
              <label htmlFor="darkmode" className="text-lg  font-medium text-white">
                {" "}
                Dark Mode
              </label>
            </div>

            <div className="block">
              <input
                className="w-4 translate-y-[1px] h-4"
                type="checkbox"
                name="curlocation"
                id="curlocation"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(!!e.target.checked)}
              />
              <label htmlFor="curlocation" className="text-lg font-medium text-white ">
                {" "}
                Use Current Location
              </label>
            </div>

            <div className="block">
              <label htmlFor="location">Default Location</label>
              <select
                id="location"
                className="disabled:text-gray-600 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setDefaultLocation(e.target.value as DefaultLocation)}
                disabled={useCurrentLocation}
                value={defaultLocation}
              >
                {CITIES.map((city) => (
                  <option value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
