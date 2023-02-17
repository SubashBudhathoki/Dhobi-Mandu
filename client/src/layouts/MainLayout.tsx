import React from "react";
import Footer from "../partials/Footer";
import NavBar from "../partials/NavBar";
import Topbar from "../partials/Topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
