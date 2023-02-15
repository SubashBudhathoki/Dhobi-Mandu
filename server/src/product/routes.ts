import { Router } from "express";
import VC from "./controller";

import VendorMiddleware from "../vendor/middleware";

const router = Router();

router.get("/", VC.showAll);
router.get("/:id", VC.showOne);

router.post("/create", VendorMiddleware.isLoggedIn, VC.create);
router.patch("/update/:id", VendorMiddleware.isLoggedIn, VC.update);
router.delete("/delete/:id", VendorMiddleware.isLoggedIn, VC.delete);

export default router;
