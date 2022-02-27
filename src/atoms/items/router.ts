import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getItems);

router.get("/:id", controller.getItem);

router.get("/:roomId", controller.getRoomItems);

router.post("/", controller.createItem);

router.put("/:id", controller.updateItem);

router.delete("/:id", controller.deleteItem);

export default router;
