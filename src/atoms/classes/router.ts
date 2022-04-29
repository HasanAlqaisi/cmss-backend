import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getClasses);

router.post("/", controller.createClass);

router.delete("/", controller.deleteClass);

export default router;
