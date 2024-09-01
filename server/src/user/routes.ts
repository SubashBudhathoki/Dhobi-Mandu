import { Router } from "express";
import UC from "./controller";
import Middleware from "./middleware";
import VendorMiddleware from "../vendor/middleware";

const router = Router();

router.get("/me", Middleware.isLoggedIn, UC.me);
router.get("/all", VendorMiddleware.isLoggedIn, UC.all);
router.patch("/update", Middleware.isLoggedIn, UC.update);
router.post("/login", UC.login);
router.post("/register", UC.register);
router.delete("/logout", UC.logout);
export default router;
