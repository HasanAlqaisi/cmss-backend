import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
   
  controller.getApplicants
);

router.post(
  "/",
   
  controller.createApplicant
);

router.put(
  "/:id",
   
  controller.updateApplicant
);

router.delete(
  "/",
   
  controller.deleteApplicants
);

router.delete(
  "/:id",
   
  controller.deleteApplicant
);

export default router;
