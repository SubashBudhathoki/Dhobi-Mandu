import ALink from "../components/common/ALink";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import CartDrawer from "../components/cart/CartDrawer";
import { useMutation } from "@tanstack/react-query";
import { TReturnData, TReturnError, UserLogout } from "../api/api";
import { AxiosError } from "axios";
import { Text } from "@mantine/core";
import { Navigate } from "react-router-dom";
export default function NavBar() {
  const { authState, dispatch } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    isLoading: logoutLoading,
    isSuccess: logoutSuccess,
    error: logoutError,
    mutate: logoutUser,
  } = useMutation<TReturnData<{}>, AxiosError<TReturnError>>({
    mutationFn: () => UserLogout(),
  });
  useEffect(() => {
    if (logoutSuccess) dispatch({ type: "logout" });
  }, [logoutSuccess]);

  if (
    !authState.authenticated &&
    authState.user === undefined &&
    authState.vendor === undefined
  ) {
    console.log("NAVIGATE");
    return <Navigate to="/" />;
  }
  const NoAuthNavItem = (
    <>
      <ALink href="/login" className="nav-item nav-link">
        Login
      </ALink>
      <ALink href="/register" className="nav-item nav-link">
        Register
      </ALink>
    </>
  );
  const AuthNavItem = (
    <>
      <ALink
        href={authState.user !== undefined ? "/dashboard" : "/vendor/dashboard"}
        className="nav-item nav-link"
      >
        Dashboard
      </ALink>
      {authState.user !== undefined && (
        <p
          onClick={() => setDrawerOpen(true)}
          role="button"
          className="nav-item nav-link"
        >
          Cart
        </p>
      )}
    </>
  );
  return (
    <>
      <div className="container-fluid position-relative nav-bar p-0">
        <div
          className="container-lg position-relative p-0 px-lg-3"
          style={{ zIndex: 9 }}
        >
          <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 pl-3 pl-lg-5">
            <ALink href="/" className="navbar-brand">
              <h1 className="m-0 text-secondary">
                <span className="text-primary">DRY</span>ME
              </h1>
            </ALink>
            <button
              type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-between px-3"
              id="navbarCollapse"
            >
              <div className="navbar-nav ml-auto py-0">
                <ALink href="/" className="nav-item nav-link active">
                  Home
                </ALink>
                <ALink href="/about" className="nav-item nav-link">
                  About
                </ALink>
                <ALink href="/service" className="nav-item nav-link">
                  Services
                </ALink>
                <p className="nav-item nav-link"> | </p>
                {authState.authenticated === false && NoAuthNavItem}
                {authState.authenticated && AuthNavItem}

                <p className="nav-item nav-link"> | </p>
                <Text
                  color="dimmed"
                  role="button"
                  className="nav-item nav-link"
                  onClick={() => {
                    if (!logoutLoading) logoutUser();
                    // redirect("/");
                  }}
                >
                  Logout
                </Text>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <CartDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
  );
}
