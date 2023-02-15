import { Router } from "express";
import VC from "./controller";

const router = Router();

router.get("/", VC.showAll);
router.get("/:id", VC.showOne);

router.post("/create", VC.create);
router.patch("/update/:id", VC.update);
router.delete("/delete/:id", VC.delete);

export default router;
