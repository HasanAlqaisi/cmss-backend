import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.get(
  "/",
   
  controller.getRooms
);

router.post(
  "/",
   
  controller.createRoom
);

router.put(
  "/:id",
   
  controller.updateRoom
);

router.delete(
  "/:id",
   
  controller.deleteRoom
);

export default router;
