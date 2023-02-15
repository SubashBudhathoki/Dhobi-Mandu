import { Router } from "express";
import VC from "./controller";
import Middleware from "./middleware";
const router = Router();

router.post("/login", VC.login);
router.post("/register", VC.register);
router.delete("/logout", VC.logout);

router.patch("/change-order-state", Middleware.isLoggedIn, VC.changeOrderState);

export default router;
