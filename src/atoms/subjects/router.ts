import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getSubjects);

router.post("/", controller.createSubject);

router.patch("/:id", controller.updateSubject);

router.delete("/:id", controller.deleteSubject);

export default router;
