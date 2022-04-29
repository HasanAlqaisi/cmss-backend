import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getAbsences);

router.patch("/:id", controller.updateAbsence);

export default router;
