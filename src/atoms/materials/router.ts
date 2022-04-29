import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getMaterials);

router.post("/", controller.createMaterials);

router.patch("/:id", controller.updateMaterial);

router.delete("/:id", controller.deleteMaterial);

export default router;
