import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getChannels);

router.post("/", controller.createChannel);

router.put("/:id", controller.updateChannel);

router.delete("/:id", controller.deleteChannel);

export default router;
