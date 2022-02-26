import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",

  controller.getSubjects
);

router.post(
  "/",

  controller.createSubject
);

router.put(
  "/:id",

  controller.updateSubject
);

router.delete(
  "/:id",

  controller.deleteSubject
);

export default router;
