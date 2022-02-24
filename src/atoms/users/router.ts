import { Router } from "express";
import passport from "passport";
import * as controller from "./controller";

const router = Router();

router.post("/signup", controller.signupPost);

router.post("/login", controller.loginPost);

// Only root can changes password of his account and other accounts
router.put(
  "/change-password/:id",
  passport.authenticate("jwt", { session: false }),
  controller.changePassPut
);

router.post("/forget-password/", controller.forgetPasswordPost);

router.post("/reset-password/:id/:token", controller.resetPasswordPost);

router.get("/", controller.getUsers);

router.get("/:id", controller.getUserById);

export default router;
