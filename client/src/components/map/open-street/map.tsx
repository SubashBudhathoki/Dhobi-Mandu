import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { AstarGet, TReturnData, TReturnError } from "../../../api/api";
import { useAuth } from "../../../context/authContext";
import { TMapGeoJSONType } from "../../../utils/types";
import L from "leaflet";
export type LatLng = {
  latitude: number;
  longitude: number;
};

export default function Map({ start, end }: { start: LatLng; end: LatLng[] }) {
  // only take first end point

  const { authState } = useAuth();
  const [endPoint] = end;

  const [startMarker, setStartMarker] = useState("/icons/user-icon.svg");
  const [endMarker, setEndMarker] = useState("/icons/vendor-icon.svg");

  const { isSuccess, isLoading, isError, data } = useQuery<
    TReturnData<TMapGeoJSONType>,
    TReturnError
  >({
    queryKey: [
      `astar-${start.latitude}-${start.longitude}-${endPoint.latitude}-${endPoint.longitude}`,
    ],
    queryFn: () => AstarGet(start, endPoint),
  });

  useEffect(() => {
    if (authState.user) {
      setStartMarker("/icons/user-icon.svg");
      setEndMarker("/icons/vendor-icon.svg");
    } else if (authState.vendor) {
      setStartMarker("/icons/vendor-icon.svg");
      setEndMarker("/icons/user-icon.svg");
    }
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <div>Loading...</div>
      ) : data ? (
        <MapContainer
          className=""
          center={[endPoint.latitude, endPoint.longitude]}
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            icon={
              new L.Icon({
                iconUrl: startMarker,
                iconSize: [25, 25],
              })
            }
            autoPan={true}
            position={[start.latitude, start.longitude]}
          />
          <Marker
            icon={
              new L.Icon({
                iconUrl: endMarker,
                iconSize: [25, 25],
              })
            }
            position={[endPoint.latitude, endPoint.longitude]}
          />

          <GeoJSON
            data={data as any}
            pathOptions={{
              color: "black",
              stroke: true,
            }}
          />
        </MapContainer>
      ) : (
        <>Error</>
      )}
    </div>
  );
}
