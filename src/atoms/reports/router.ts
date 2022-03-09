import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/:classId", controller.getReports);

router.post("/:classId", controller.createReport);

export default router;
