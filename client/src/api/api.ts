import {
  TAllService,
  TOrderRequest,
  TOrderResponse,
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

axiosRetry(axiosInstance, {
  retries: 0,
  retryCondition: () => false,

  onRetry: (err) => {
    const config = err;
    console.log(`Retry attempt `);
  },
});

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

// order routes
export async function OrderCreate(
  data: TOrderRequest
): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.post(`${BASE_URL}/order/create`, data, {
    withCredentials: true,
  });
  return response.data;
}
export async function OrderUser(): Promise<TReturnData<TOrderResponse>> {
  const response = await axiosInstance.get(`${BASE_URL}/order/my-order`, {
    withCredentials: true,
  });
  return response.data;
}
