import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getbranches);

router.post("/", controller.createBranch);

router.patch("/:id", controller.updateBranch);

router.delete("/:id", controller.deleteBranch);

export default router;
