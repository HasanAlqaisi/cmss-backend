import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
   
  controller.getSpecialties
);

router.post(
  "/",
   
  controller.createSpecialty
);

router.put(
  "/:id",
   
  controller.updateSpecialty
);

router.delete(
  "/:id",
   
  controller.deleteSpecialty
);

export default router;
