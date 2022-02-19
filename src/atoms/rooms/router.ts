import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getRooms
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createRoom
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateRoom
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteRoom
);

export default router;
