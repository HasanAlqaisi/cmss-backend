import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.post(
  "/",
   
  controller.createSchedule
);

export default router;
