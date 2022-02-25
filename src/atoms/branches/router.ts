import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getbranches
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createBranch
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateBranch
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteBranch
);

export default router;
