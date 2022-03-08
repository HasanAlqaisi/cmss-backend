import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getAbsences);

router.put("/:id", controller.updateAbsence);

export default router;
