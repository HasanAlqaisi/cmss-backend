import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/:classId", controller.getWarnings);

router.post("/:classId", controller.createWarning);

export default router;
