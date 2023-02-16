import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import CustomLoader from "./CustomLoader";
import { AStar } from "../utils/algorithm";

const center = {
  lat: 40.7128,
  lng: -74.006,
};

export default function Map() {
  const { isLoaded: mapIsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "visualization", "geometry"],
  });

  if (!mapIsLoaded) return <CustomLoader />;
  else return <RenderMap />;
}

function RenderMap() {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  //   async function calcRoute() {
  //     setDirectionResponse(null);
  //     if (!fromRef.current || !toRef.current) return;

  //     if (fromRef.current.value == "" || toRef.current.value == "") return;

  //     const directionsService = new google.maps.DirectionsService();
  //     const results = await directionsService.route({
  //       origin: fromRef.current?.value,
  //       destination: toRef.current?.value,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     });

  //     setDirectionResponse(results);
  //   }

  return (
    <div>
      {map && (
        <>
          <div>
            <label htmlFor="from">From</label>
            <Autocomplete>
              <input ref={fromRef} type="text" name="from" id="from" />
            </Autocomplete>
          </div>
          <div>
            <label htmlFor="to">To</label>
            <Autocomplete>
              <input ref={toRef} type="text" name="to" id="to" />
            </Autocomplete>
          </div>
          <div>
            <button
              onClick={async function () {
                if (fromRef.current && toRef.current) {
                  const aStar = await AStar(
                    fromRef.current.value,
                    toRef.current.value
                  );
                  console.log(aStar);
                }
              }}
            >
              Calculate Route
            </button>
            <button
              onClick={() => {
                map.panTo(center);
              }}
            >
              Re Center Map
            </button>
          </div>
        </>
      )}
      <GoogleMap
        onLoad={(map) => setMap(map)}
        zoom={10}
        center={center}
        mapContainerStyle={{
          height: "100vh",
          width: "100vw",
        }}
      >
        {directionResponse && (
          <DirectionsRenderer
            options={{
              polylineOptions: {
                strokeColor: "green",
                strokeWeight: 5,
              },
            }}
            directions={directionResponse}
          />
        )}
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
