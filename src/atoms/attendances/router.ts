import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getAttendances);

router.post("/", controller.createAttendance);

router.put("/:id", controller.updateAttendance);

router.delete("/:id", controller.deleteAttendance);

export default router;
