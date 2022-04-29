import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getRooms);

router.post("/", controller.createRoom);

router.patch("/:id", controller.updateRoom);

router.delete("/:id", controller.deleteRoom);

export default router;
