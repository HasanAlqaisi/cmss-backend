import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createSchedule
);

export default router;
