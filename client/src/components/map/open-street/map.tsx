import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { AstarGet, TReturnData, TReturnError } from "../../../api/api";
import { TMapGeoJSONType } from "../../../utils/types";

export type LatLng = {
  latitude: number;
  longitude: number;
};

export default function Map({ start, end }: { start: LatLng; end: LatLng[] }) {
  // only take first end point
  const [endPoint] = end;

  const { isSuccess, isLoading, isError, data } = useQuery<
    TReturnData<TMapGeoJSONType>,
    TReturnError
  >({
    queryKey: [
      `astar-${start.latitude}-${start.longitude}-${endPoint.latitude}-${endPoint.longitude}`,
    ],
    queryFn: () => AstarGet(start, endPoint),
  });

  if (data) {
    let x: any = data;
    const allPathLen = x.features[0].geometry.coordinates.length;
    const lastPathArrLen =
      x.features[0].geometry.coordinates[allPathLen - 1].length;
    console.log(
      x.features[0].geometry.coordinates[0][0][1],
      x.features[0].geometry.coordinates[0][0][0]
    );
    console.log(
      x.features[0].geometry.coordinates[allPathLen - 1][lastPathArrLen - 1][1],
      x.features[0].geometry.coordinates[allPathLen - 1][lastPathArrLen - 1][0]
    );
  }

  return (
    <div className="container">
      {isLoading ? (
        <div>Loading...</div>
      ) : data ? (
        <MapContainer
          center={[27.7054344, 85.3198591]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker
            position={[
              endPoint.longitude, //
              endPoint.latitude,
            ]}
          /> */}
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
