import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getLists);

router.post("/", controller.createList);

router.get("/:id", controller.getList);

router.delete("/:id", controller.deleteList);

export default router;
