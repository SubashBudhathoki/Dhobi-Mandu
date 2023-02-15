import { Router } from "express";
import OrderController from "./controller";
import VendorMiddleware from "../vendor/middleware";
import UserMiddleware from "../user/middleware";
const router = Router();

// user
router.post("/create", UserMiddleware.isLoggedIn, OrderController.create);
router.get("/my-order", UserMiddleware.isLoggedIn, OrderController.getMyOrders);
export default router;

// vendor
router.get("/", VendorMiddleware.isLoggedIn, OrderController.getAllOrders);
router.get("/:id", VendorMiddleware.isLoggedIn, OrderController.getSingleOrder);
router.patch(
  "/change-order-state/:id",
  VendorMiddleware.isLoggedIn,
  OrderController.changeOrderState
);
