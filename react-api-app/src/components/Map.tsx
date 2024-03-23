import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Coords } from "../utils";
import { useContext } from "react";
import { AppCtx } from "../AppCtx";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "/pin.png", // The URL to the image file
  iconSize: [50, 50], // Size of the icon in pixels
  iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
  // Point from which the popup should open relative to the iconAnchor
});

function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: false });
  return null;
}

export default function Map({ location }: { location: Coords }) {
  const coords: L.LatLngExpression = [location.lat, location.lon];
  const { darkMode } = useContext(AppCtx);
  console.log(coords);
  return (
    <div className="w-[40%] rounded-[25px] overflow-hidden h-full  ">
      <MapContainer center={coords} zoom={10} zoomControl={false}>
        <ChangeView center={coords} />
        <TileLayer
          attribution=""
          url={
            darkMode
              ? "https://tile.jawg.io/b2b117b5-11fc-459b-a4e1-eaf8bc1d91d5/{z}/{x}/{y}{r}.png?access-token=vpxmqZfPKNmXReJ7ArrixBS7jkAMkfhAHIWKG9DZfHAvZzE0M3aIUr3AwXzrMWz9"
              : "https://tile.jawg.io/5f65e2d3-137c-47d6-90e6-3c7bbe8f8bff/{z}/{x}/{y}{r}.png?access-token=vpxmqZfPKNmXReJ7ArrixBS7jkAMkfhAHIWKG9DZfHAvZzE0M3aIUr3AwXzrMWz9"
          }
        />
        <Marker position={coords} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
