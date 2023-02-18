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

export type TOrderResponse = Array<{
  id: number;
  userId: number;
  total: number;
  state: TORDER_STATE;
  user: TUser;
  OrderItems: Array<{
    id: number;
    serviceId: number;
    quantity: number;
    total: number;
    orderId: number;
    Service: TSingleService & {
      vendorId: number;
    };
  }>;
}>;
