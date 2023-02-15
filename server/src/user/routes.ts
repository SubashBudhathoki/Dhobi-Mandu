import { Router } from "express";
import UC from "./controller";
import Middleware from "./middleware";
const router = Router();

router.get("/dashboard", Middleware.isLoggedIn, UC.dashboard);
router.post("/login", UC.login);
router.post("/register", UC.register);
router.delete("/logout", UC.logout);
export default router;
