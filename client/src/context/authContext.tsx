import { createContext, useContext, useEffect, useReducer } from "react";
import { TReturnData, TReturnError, UserGet } from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ServerError from "../components/common/ServerError";
import { AxiosError } from "axios";
import CustomLoader from "../components/common/CustomLoader";
import { TUser } from "../utils/types";

type AuthState = {
  user: TUser | undefined;
  authenticated: boolean;
};

type AuthAction =
  | {
      type: "register";
      payload: TUser;
    }
  | { type: "login"; payload: TUser }
  | { type: "logout" }
  | { type: "setMe"; payload: TUser };

type AuthContextType = {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};
const AuthContext = createContext<AuthContextType>({
  authState: {
    user: undefined,
    authenticated: false,
  },
  dispatch: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return {
        authenticated: true,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        },
      };
    case "register":
      return {
        authenticated: true,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        },
      };
    case "logout":
      return {
        authenticated: false,
        user: undefined,
      };
    case "setMe":
      return {
        authenticated: true,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        },
      };
    default:
      return state;
  }
}

export const useAuth = () => useContext(AuthContext);

const initialState: AuthState = {
  user: undefined,
  authenticated: false,
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    refetch: userRefetch,
  } = useQuery<TReturnData<TUser>, AxiosError<TReturnError>>({
    queryKey: ["me"],
    queryFn: () => UserGet(),
    enabled: false,
  });

  const [authState, dispatch] = useReducer(authReducer, initialState);
  const value = { authState, dispatch };
  useEffect(() => {
    userRefetch();
  }, []);

  useEffect(() => {
    if (userData) {
      dispatch({ type: "setMe", payload: userData.data });
    }
  }, [userData]);

  useEffect(() => {
    if (userError) {
      dispatch({ type: "logout" });
    }
  }, [userError]);

  return (
    <AuthContext.Provider value={value}>
      {userLoading ? <CustomLoader /> : children}
    </AuthContext.Provider>
  );
}
