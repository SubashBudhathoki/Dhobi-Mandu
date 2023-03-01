import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
  Polyline,
  DirectionsService,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import CustomLoader from "../common/CustomLoader";
import { AStar } from "../../utils/algorithm";

const center = {
  lat: 27.7032447,
  lng: 85.3131068,
};

export default function DisplayGoogleMap() {
  const { isLoaded: mapIsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "visualization", "geometry"],
  });

  if (!mapIsLoaded) return <CustomLoader />;
  else return <RenderMap />;
}

interface LatLng {
  lat: number;
  lng: number;
}

function RenderMap() {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [latLngs, setLatLngs] = useState<google.maps.LatLng[]>([]);
  const [markerPoints, setMarkerPoints] = useState<google.maps.LatLng[]>([]);

  function LoadMapData() {
    const pathStr = localStorage.getItem("path");
    const path = pathStr ? JSON.parse(pathStr) : null;
    if (path) {
      console.log(path);
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
              onClick={async function () {
                if (fromRef.current && toRef.current) {
                  const mapPoints = await AStar(
                    fromRef.current.value,
                    toRef.current.value,
                    map
                  );
                  if (!mapPoints) return;

                  const pathLatLng = mapPoints.reversedPath.map((p) => {
                    return new google.maps.LatLng(p.lat, p.lng);
                  });
                  const markerPoints = mapPoints.scannedNodes.map((n) => {
                    return n.latLng;
                  });

                  setLatLngs(pathLatLng);
                  setMarkerPoints(markerPoints);
                  map.panTo(pathLatLng[0]);
                }
              }}
            >
              Calculate Route
            </button>
            <button
              onClick={async function () {
                if (fromRef.current && toRef.current) {
                  const k = await AStar(
                    fromRef.current.value,
                    toRef.current.value,
                    map
                  );
                  console.log("k", k);
                }
                LoadMapData();
              }}
            >
              Load GPS
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
        {latLngs.length > 0 && (
          <>
            <Polyline path={latLngs} />
            <Marker position={latLngs[0]} />;
            <Marker position={latLngs[latLngs.length - 1]} />;
          </>
        )}
        {/* {markerPoints.length > 0 && (
          // <div>
          //   {markerPoints.map((p, i) => {
          //     return <Marker key={i} position={p} />;
          //   })}
          // </div>
        )} */}
        {/* <Marker position={center} /> */}
      </GoogleMap>
    </div>
  );
}
