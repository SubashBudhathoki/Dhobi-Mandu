export type TSingleService = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};
export type TAllService = TSingleService[];

export type TUser = {
  id: number;
  name: string;
  email: string;
  address: string;
  address_latitude: number;
  address_longitude: number;
};

export type TCartItem = {
  service: TSingleService;
  quantity: number;
  total: number;
};

export type TCart = TCartItem[];

export type TORDER_STATE =
  | "RECEIVED"
  | "WASHING"
  | "SHIPPING"
  | "CANCELLED"
  | "COMPLETED";

export type TOrderRequest = Array<{
  serviceId: number;
  quantity: number;
}>;

export type TSingleOrderItem = {
  id: number;
  serviceId: number;
  quantity: number;
  total: number;
  orderId: number;
  Service: TSingleService & {
    vendorId: number;
    vendor: TUser;
  };
};

export type TSingleOrder = {
  id: number;
  userId: number;
  total: number;
  state: TORDER_STATE;
  user: TUser;
  OrderItems: TSingleOrderItem[];
};

export type TOrderResponse = Array<TSingleOrder>;

export type TMapGeoJSONType = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {};
    geometry: {
      type:
        | "Point"
        | "LineString"
        | "Polygon"
        | "MultiPoint"
        | "MultiLineString"
        | "MultiPolygon"
        | "GeometryCollection"
        | "Feature"
        | "FeatureCollection";
      coordinates: Array<Array<Array<number>>>;
    };
  }>;
};
