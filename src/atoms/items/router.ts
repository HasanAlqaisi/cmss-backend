import { Router } from "express";
import uploadImageOnMemory from "../../utils/upload-image-on-memory";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getItems);

router.get("/:id", controller.getItem);

router.post("/", uploadImageOnMemory.single("image"), controller.createItem);

router.put("/:id", uploadImageOnMemory.single("image"), controller.updateItem);

router.delete("/:id", controller.deleteItem);

export default router;
