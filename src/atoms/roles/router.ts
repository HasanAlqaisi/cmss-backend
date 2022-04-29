import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getRoles);

router.post("/", controller.createRole);

router.patch("/:id", controller.updateRole);

router.delete("/:id", controller.deleteRole);

export default router;
