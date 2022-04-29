import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getApplicants);

router.post("/", controller.createApplicant);

router.patch("/:id", controller.updateApplicant);

router.delete("/", controller.deleteApplicants);

router.delete("/:id", controller.deleteApplicant);

export default router;
