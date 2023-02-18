import { redirect, RouteProps, Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import React, { ComponentType, FC } from "react";

export default function WithAuth<T extends RouteProps>(
  Component: ComponentType<T>,
  authEntity: "USER" | "VENDOR" = "USER"
) {
  return function AuthenticatedComponent(props: T) {
    const { authState } = useAuth();
    console.log("authState", authState);
    if (authEntity === "USER" && authState.user === undefined) {
      console.log("GO BACK TO USR LOGIN");
      return <Navigate to={"/login"} />;
    }
    if (authEntity === "VENDOR" && authState.vendor === undefined) {
      console.log("GO BACK TO VENDOR LOGIN 2", authState);
      return <Navigate to={"/vendor/login"} />;
    }

    return <Component {...props} />;
  };
}
