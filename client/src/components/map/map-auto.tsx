import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
  Polyline,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "../common/CustomLoader";

const center = {
  lat: 22.674087,
  lng: 88.5404,
};

export default function Map() {
  const { isLoaded: mapIsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "visualization"],
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
  const divRef = useRef<HTMLDivElement>(null);
  const [latLngs, setLatLngs] = useState<google.maps.LatLng[]>([]);

  async function calcRoute() {
    setDirectionResponse(null);
    if (!fromRef.current || !toRef.current || !divRef.current) return;

    if (fromRef.current.value == "" || toRef.current.value == "") return;

    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: fromRef.current?.value,
      destination: toRef.current?.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const llgs = results.routes[0].overview_path.map((latLng) => {
      return {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
    });
    localStorage.setItem("latLngs", JSON.stringify(llgs));
    setLatLngs(results.routes[0].overview_path);
    setDirectionResponse(results);
  }
  function LoadPath() {
    const latLngs = localStorage.getItem("path");
    if (latLngs) {
      const llgs: { lat: number; lng: number }[] = JSON.parse(latLngs);
      const latLngsG = llgs.map((llg) => {
        return new google.maps.LatLng(llg.lat, llg.lng);
      });
      console.log(latLngsG);
      if (map) map.panTo(latLngsG[0]);
      setLatLngs(latLngsG);
    }
  }
  return (
    <div>
      {map && (
        <>
          <div ref={divRef}></div>
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
              onClick={() => {
                LoadPath();
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
      {latLngs.length > 0 && <div>MORE1</div>}

      <GoogleMap
        onLoad={(map) => setMap(map)}
        zoom={10}
        center={center}
        mapContainerStyle={{
          height: "100vh",
          width: "100vw",
        }}
      >
        {/* {directionResponse && (
           <DirectionsRenderer
              options={{
                polylineOptions: {
                  strokeColor: "red",
                  strokeWeight: 5,
                },
              }}
              directions={directionResponse}
            /> 
        )} */}
        {latLngs.length > 0 && <Polyline path={latLngs} />}
        {/* <Marker position={center} /> */}
      </GoogleMap>
    </div>
  );
}
