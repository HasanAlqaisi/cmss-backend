import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getAttendances);

router.post("/start-session", controller.startAttendanceSession);

router.post("/toggle", controller.toggleAttendance);

router.patch("/:id", controller.updateAttendance);

router.delete("/:id", controller.deleteAttendance);

export default router;
