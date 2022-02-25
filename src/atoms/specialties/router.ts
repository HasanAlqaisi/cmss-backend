import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getSpecialties
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createSpecialty
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateSpecialty
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteSpecialty
);

export default router;
