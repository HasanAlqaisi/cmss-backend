import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getSpecialties);

router.post("/", controller.createSpecialty);

router.patch("/:id", controller.updateSpecialty);

router.delete("/:id", controller.deleteSpecialty);

export default router;
