import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getApplicants
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createApplicant
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateApplicant
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.deleteApplicants
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteApplicant
);

export default router;
