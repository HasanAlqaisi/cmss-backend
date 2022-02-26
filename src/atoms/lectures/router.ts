import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
   
  controller.getLectures
);

router.post(
  "/",
   
  controller.createLecture
);

router.put(
  "/:id",
   
  controller.updateLecture
);

router.delete(
  "/:id",
   
  controller.deleteLecture
);

export default router;
