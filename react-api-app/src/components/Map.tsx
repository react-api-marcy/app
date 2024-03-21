import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UserLocation } from "../utils";

interface PreciseLoc {
  kind: "precise";
  lat: number;
  lon: number;
}
interface MapProps {
  location: PreciseLoc;
}

function Map({ location }: MapProps) {
  const loc = location;
  const [lon, lat] = [loc.lon, loc.lat];
  console.log(lon, lat);

  return (
    lon &&
    lat && (
      <div className="w-[40%] rounded-[25px] overflow-hidden h-full  ">
        <MapContainer center={[lat, lon]} zoom={13} zoomControl={false}>
          <TileLayer
            attribution=""
            url="https://tile.jawg.io/5f65e2d3-137c-47d6-90e6-3c7bbe8f8bff/{z}/{x}/{y}{r}.png?access-token=vpxmqZfPKNmXReJ7ArrixBS7jkAMkfhAHIWKG9DZfHAvZzE0M3aIUr3AwXzrMWz9"
          />
          <Marker position={[lat, lon]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  );
}

export default Map;
