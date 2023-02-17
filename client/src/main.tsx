import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import MainLayout from "./layouts/MainLayout";
import AuthProvider from "./context/authContext";
import CartProvider from "./context/cartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/style.min.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout>
            <Router />
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);
{
  /* </React.StrictMode> */
}
