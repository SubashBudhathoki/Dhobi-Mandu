import {
  TAllService,
  TOrderRequest,
  TOrderResponse,
  TORDER_STATE,
  TSingleService,
  TUser,
} from "./../utils/types";
// use tanstack-query
const BASE_URL = import.meta.env.VITE_SERVER_URI || "http://localhost:3000";
import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosRetry(axiosInstance, { retries: 1 });

export type TReturnData<T> = {
  success: boolean;
  data: T;
  message: string;
};
export type TReturnError = {
  success: boolean;
  data: any;
  message: string;
};

// user routes
export async function UserGet(): Promise<TReturnData<TUser>> {
  const response = await axiosInstance.get(`${BASE_URL}/user/me`, {
    withCredentials: true,
  });
  return response.data;
}

export async function UserLogin(data: {
  email: string;
  password: string;
}): Promise<
  TReturnData<{
    user: TUser;
    token: {
      accessToken: string;
    };
  }>
> {
  const response = await axiosInstance.post(`${BASE_URL}/user/login`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function UserRegister(data: {
  name: string;
  email: string;
  password: string;
  address: string;
}): Promise<TReturnData<TUser>> {
  const response = await axiosInstance.post(`${BASE_URL}/user/register`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function UserLogout(): Promise<TReturnData<{}>> {
  const response = await axiosInstance.delete(`${BASE_URL}/user/logout`, {
    withCredentials: true,
  });
  return response.data;
}

export async function UserUpdate(
  data: Omit<TUser, "id">
): Promise<TReturnData<TUser>> {
  const response = await axiosInstance.patch(`${BASE_URL}/user/update`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function ServiceGet(): Promise<TReturnData<TAllService>> {
  const response = await axiosInstance.get(`${BASE_URL}/service`, {
    withCredentials: true,
  });
  return response.data;
}

export async function ServiceGetById(
  id: string
): Promise<TReturnData<TSingleService>> {
  const response = await axiosInstance.get(`${BASE_URL}/service/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function ServiceCreate(
  data: Omit<TSingleService, "id">
): Promise<TReturnData<TSingleService>> {
  const response = await axiosInstance.post(
    `${BASE_URL}/service/create`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
export async function ServiceUpdate(
  data: TSingleService
): Promise<TReturnData<TSingleService>> {
  const response = await axiosInstance.patch(
    `${BASE_URL}/service/update/${data.id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
export async function ServiceDelete(id: number): Promise<TReturnData<{}>> {
  const response = await axiosInstance.delete(
    `${BASE_URL}/service/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
// order routes
export async function OrderCreate(
  data: TOrderRequest
): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.post(`${BASE_URL}/order/create`, data, {
    withCredentials: true,
  });
  return response.data;
}
export async function OrderChangeState(data: {
  state: TORDER_STATE;
  id: number;
}): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.patch(
    `${BASE_URL}/order/change-order-state/${data.id}`,
    {
      state: data.state,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function OrderUser(): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.get(`${BASE_URL}/order/my-order`, {
    withCredentials: true,
  });
  return response.data;
}

export async function OrderGet(): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.get(`${BASE_URL}/order`, {
    withCredentials: true,
  });
  return response.data;
}

// vendor
export async function VendorGet(): Promise<TReturnData<TUser>> {
  const response = await axiosInstance.get(`${BASE_URL}/vendor/me`, {
    withCredentials: true,
  });
  return response.data;
}

export async function VendorLogin(data: {
  email: string;
  password: string;
}): Promise<
  TReturnData<{
    vendor: TUser;
    token: {
      accessToken: string;
    };
  }>
> {
  const response = await axiosInstance.post(`${BASE_URL}/vendor/login`, data, {
    withCredentials: true,
  });
  return response.data;
}
export async function VendorUpdate(
  data: Omit<TUser, "id">
): Promise<TReturnData<TUser>> {
  const response = await axiosInstance.patch(
    `${BASE_URL}/vendor/update`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
