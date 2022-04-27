import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getClasses);

router.get("/", controller.createClass);

router.get("/", controller.deleteClass);

export default router;
