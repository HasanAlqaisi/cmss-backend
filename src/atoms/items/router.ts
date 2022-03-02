import { Router } from "express";
import * as controller from "./controller";
import { uploadOnDisk, uploadOnMemory } from "./helpers";

const router = Router();

router.get("/", controller.getItems);

router.get("/:id", controller.getItem);

router.post("/", uploadOnMemory.single("image"), controller.createItem);

router.put("/:id", uploadOnMemory.single("image"), controller.updateItem);

router.delete("/:id", controller.deleteItem);

export default router;
