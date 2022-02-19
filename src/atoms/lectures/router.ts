import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getLectures
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createLecture
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateLecture
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteLecture
);

export default router;
