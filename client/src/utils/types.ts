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
