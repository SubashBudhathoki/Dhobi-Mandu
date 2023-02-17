import { redirect, RouteProps, Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import React, { ComponentType, FC } from "react";

export default function WithAuth<T extends RouteProps>(
  Component: ComponentType<T>,
  loginRoute: string = "/login"
) {
  return function AuthenticatedComponent(props: T) {
    const { authState } = useAuth();
    if (authState.authenticated === false) {
      return <Navigate to={loginRoute} />;
    }

    return <Component {...props} />;
  };
}
