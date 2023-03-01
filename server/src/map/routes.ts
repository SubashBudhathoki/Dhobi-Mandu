import { Router } from "express";
import controller from "./controller";

const router = Router();

router.post("/astar", controller.aStarDb);

export default router;
