import ALink from "../components/common/ALink";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import CartDrawer from "../components/cart/CartDrawer";
import { useMutation } from "@tanstack/react-query";
import { TReturnData, TReturnError, UserLogout } from "../api/api";
import { AxiosError } from "axios";
import { Text } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
export default function NavBar() {
  const { authState, dispatch } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobNavOpen, setMobNavOpen] = useState(false);
  const {
    isLoading: logoutLoading,
    isSuccess: logoutSuccess,
    error: logoutError,
    mutate: logoutUser,
  } = useMutation<TReturnData<{}>, AxiosError<TReturnError>>({
    mutationFn: () => UserLogout(),
  });

  if (logoutLoading) {
    showNotification({
      id: "logout-notification",
      title: "Loading",
      message: "Logging you Out",
      loading: true,
    });
  }
  if (logoutError) {
    updateNotification({
      id: "logout-notification",
      title: "Error",
      message: "Error Logging you Out",
      icon: <X />,
      color: "red",
    });
  }
  if (logoutSuccess) {
    updateNotification({
      id: "logout-notification",
      title: "Success",
      message: "Logged you Out",
      icon: <Check />,
      color: "green",
    });
  }

  useEffect(() => {
    if (logoutSuccess) dispatch({ type: "logout" });
  }, [logoutSuccess]);

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
                {/* <span className="text-primary">Dhobi-Mandu</span> */}
                <img src={"./img/logos.png"} alt="" style={{width:"100%",height:"12vh"}}/>
                
              </h1>
            </ALink>
            <button
              type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              onClick={() => setMobNavOpen(!mobNavOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`${
                mobNavOpen === false && "collapse"
              } navbar-collapse justify-content-between px-3`}
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
                {/* <p className="nav-item nav-link"> | </p> */}
                {authState.authenticated === false && (
                  <>
                    <ALink href="/login" className="nav-item nav-link">
                      Login
                    </ALink>
                    <ALink href="/register" className="nav-item nav-link">
                      Register
                    </ALink>
                    <ALink href="/vendor/login" className="nav-item nav-link">
                      I am a Vendor
                    </ALink>
                  </>
                )}
                {authState.authenticated && (
                  <>
                    <ALink
                      href={
                        authState.user !== undefined
                          ? "/dashboard"
                          : "/vendor/dashboard"
                      }
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
                    <Text
                      color="dimmed"
                      role="button"
                      className="nav-item nav-link"
                      onClick={() => {
                        if (!logoutLoading) logoutUser();
                      }}
                    >
                      Logout
                    </Text>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
      <CartDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
  );
}
