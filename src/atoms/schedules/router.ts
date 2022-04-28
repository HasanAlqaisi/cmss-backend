import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.post("/", controller.createSchedule);

router.get("/", controller.getSchedules);

export default router;
