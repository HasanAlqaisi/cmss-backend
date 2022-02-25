import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getMaterials
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createMaterials
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateMaterial
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteMaterial
);

export default router;
