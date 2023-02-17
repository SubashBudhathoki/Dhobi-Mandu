import { Routes, Route } from "react-router-dom";
import Services from "../components/page/ServicesComponent";
import About from "../pages/about";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Checkout from "../pages/checkout";
import Home from "../pages/home";
import AllService from "../pages/services/AllService";
import SingleService from "../pages/services/SingleService";
import Dashboard from "../pages/user/dashboard";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<AllService />} />
      <Route path="/service/:id" element={<SingleService />} />
      <Route path="/vendor" element={<div>Vendor Home</div>} />
      <Route path="/vendor/login" element={<div>Vendor Login</div>} />
      <Route path="/user" element={<div>User Dashboard</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
