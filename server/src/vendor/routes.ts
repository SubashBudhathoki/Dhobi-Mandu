import { Router } from "express";
import VC from "./controller";
import UC from "../user/controller";
import OC from "../order/controller";
import Middleware from "./middleware";
const router = Router();

router.post("/login", VC.login);
router.post("/register", VC.register);
router.delete("/logout", UC.logout);

router.get("/me", Middleware.isLoggedIn, VC.me);
router.get("/orders", Middleware.isLoggedIn, OC.getAllOrders);

export default router;
