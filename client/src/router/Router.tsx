import { Routes, Route } from "react-router-dom";
// import Map from "../components/map/open-street/map";
import About from "../pages/about";
import Login from "../pages/auth/user/login";
import Register from "../pages/auth/user/register";
import VendorLogin from "../pages/auth/vendor/login";
import VendorRegister from "../pages/auth/vendor/register";
import Checkout from "../pages/checkout";
import Home from "../pages/home";
import AllService from "../pages/services/AllService";
import SingleService from "../pages/services/SingleService";
import Dashboard from "../pages/user/dashboard";
import VendorDashboard from "../pages/vendor/dashboard";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<AllService />} />
      <Route path="/service/:id" element={<SingleService />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/register" element={<VendorRegister />} />
      {/* <Route path="/map-osm" element={<Map />} /> */}
    </Routes>
  );
}
