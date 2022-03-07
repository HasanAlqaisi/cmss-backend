import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getStudents);

router.post("/", controller.createStudent);

router.put("/:id", controller.updateStudent);

router.delete("/:id", controller.deleteStudent);

export default router;
