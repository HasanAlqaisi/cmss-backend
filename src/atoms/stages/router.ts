import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getStages);

router.put("/:id", controller.updateStage);

export default router;
