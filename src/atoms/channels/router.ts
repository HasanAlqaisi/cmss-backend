import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getChannels
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createChannel
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateChannel
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteChannel
);

export default router;
