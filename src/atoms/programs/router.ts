import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getPrograms);

export default router;
