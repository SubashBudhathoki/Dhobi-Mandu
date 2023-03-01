import { createContext, useContext, useEffect, useReducer } from "react";
import { TReturnData, TReturnError, UserGet, VendorGet } from "../api/api";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import CustomLoader from "../components/common/CustomLoader";
import { TUser } from "../utils/types";

type AuthState = {
  user: TUser | undefined;
  vendor: TUser | undefined;
  authenticated: boolean;
};

type AuthAction =
  | {
      type: "register";
      payload: TUser;
    }
  | {
      type: "login";
      payload: { user: TUser | undefined; vendor: TUser | undefined };
    }
  | { type: "logout" }
  | {
      type: "setMe";
      payload: { user: TUser | undefined; vendor: TUser | undefined };
    };

type AuthContextType = {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};
const AuthContext = createContext<AuthContextType>({
  authState: {
    user: undefined,
    vendor: undefined,
    authenticated: false,
  },
  dispatch: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      if (action.payload.user)
        return {
          authenticated: true,
          user: {
            id: action.payload.user.id,
            name: action.payload.user.name,
            email: action.payload.user.email,
            address: action.payload.user.address,
            address_latitude: action.payload.user.address_latitude,
            address_longitude: action.payload.user.address_longitude,
          },
          vendor: undefined,
        };
      else if (action.payload.vendor)
        return {
          authenticated: true,
          vendor: {
            id: action.payload.vendor.id,
            name: action.payload.vendor.name,
            email: action.payload.vendor.email,
            address: action.payload.vendor.address,
            address_latitude: action.payload.vendor.address_latitude,
            address_longitude: action.payload.vendor.address_longitude,
          },
          user: undefined,
        };
      return state;
    case "register":
      return {
        authenticated: true,
        vendor: undefined,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          address: action.payload.address,
          address_latitude: action.payload.address_latitude,
          address_longitude: action.payload.address_longitude,
        },
      };
    case "logout":
      return {
        authenticated: false,
        user: undefined,
        vendor: undefined,
      };
    case "setMe":
      console.log("SET ME");
      if (action.payload.user)
        return {
          authenticated: true,
          user: {
            id: action.payload.user.id,
            name: action.payload.user.name,
            email: action.payload.user.email,
            address: action.payload.user.address,
            address_latitude: action.payload.user.address_latitude,
            address_longitude: action.payload.user.address_longitude,
          },
          vendor: undefined,
        };
      else if (action.payload.vendor) {
        console.log("VENDOR");
        console.log("RETURN NEW STATE WITH VENDOR");
        return {
          authenticated: true,
          vendor: {
            id: action.payload.vendor.id,
            name: action.payload.vendor.name,
            email: action.payload.vendor.email,
            address: action.payload.vendor.address,
            address_latitude: action.payload.vendor.address_latitude,
            address_longitude: action.payload.vendor.address_longitude,
          },
          user: undefined,
        };
      }
      return state;
    default:
      return state;
  }
}

export const useAuth = () => useContext(AuthContext);

const initialState: AuthState = {
  user: undefined,
  authenticated: false,
  vendor: undefined,
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, vendor] = useQueries({
    queries: [
      {
        queryKey: ["user-me"],
        queryFn: () => UserGet(),
        enabled: false,
      },
      {
        queryKey: ["vendor-me"],
        queryFn: () => VendorGet(),
        enabled: false,
      },
    ],
  });

  const [authState, dispatch] = useReducer(authReducer, initialState);
  const value = { authState, dispatch };
  useEffect(() => {
    user.refetch();
    vendor.refetch();
  }, []);

  useEffect(() => {
    if (user.data) {
      dispatch({
        type: "setMe",
        payload: { user: user.data.data, vendor: undefined },
      });
    }
  }, [user.data]);

  useEffect(() => {
    if (vendor.data) {
      console.log("VENDOR DATA");
      dispatch({
        type: "setMe",
        payload: { vendor: vendor.data.data, user: undefined },
      });
    }
  }, [vendor.data]);

  return (
    <AuthContext.Provider value={value}>
      {user.isLoading || vendor.isLoading ? <CustomLoader /> : children}
      {/* {children} */}
    </AuthContext.Provider>
  );
}
