import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { UserLocation } from "../utils";
import "leaflet/dist/leaflet.css";

export default  function Map({ location }: { location: UserLocation }) {
  const locationArr: [number, number, number?] = [location.lon, location.lat];
  return (
    <div className="w-[40%] rounded-[25px] overflow-hidden h-full">
      <MapContainer center={locationArr} zoom={13} zoomControl={false}>
        <TileLayer
          attribution=""
          url="https://tile.jawg.io/5f65e2d3-137c-47d6-90e6-3c7bbe8f8bff/{z}/{x}/{y}{r}.png?access-token=vpxmqZfPKNmXReJ7ArrixBS7jkAMkfhAHIWKG9DZfHAvZzE0M3aIUr3AwXzrMWz9"
        />
        <Marker position={locationArr}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
