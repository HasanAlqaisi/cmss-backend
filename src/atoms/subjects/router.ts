import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getSubjects
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createSubject
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateSubject
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteSubject
);

export default router;
