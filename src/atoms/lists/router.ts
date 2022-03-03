import { Router } from "express";
import uploadImageOnMemory from "../../utils/upload-image-on-memory";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getLists);

router.post(
  "/",
  uploadImageOnMemory.single("orderImage"),
  controller.createList
);

router.get("/:id", controller.getList);

router.delete("/:id", controller.deleteList);

export default router;
