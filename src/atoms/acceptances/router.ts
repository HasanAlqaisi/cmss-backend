import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.post(
  "/:channelId",
  passport.authenticate("jwt", { session: false }),
  controller.computeAcceptances
);

export default router;
