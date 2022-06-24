import { Router } from "express";
import passport from "passport";
import checkRequester from "../../middlewares/check-requester";
import permissions from "../../middlewares/permissions";
import * as controller from "./controller";

const router = Router();

router.post(
  "/registration",
  passport.authenticate("jwt", { session: false }),
  permissions("create", "User"),
  controller.registrationPost
);

router.post("/login", controller.loginPost);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  controller.logoutPost
);

// admin can changes password of his account and other accounts
router.patch(
  "/change-password/:id",
  passport.authenticate("jwt", { session: false }),
  controller.changePassPut
);

router.post("/forget-password/", controller.forgetPasswordPost);

router.post("/reset-password/:id/:token", controller.resetPasswordPost);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  permissions("read", "User"),
  controller.getUsers
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  controller.getUserProfile
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkRequester,
  controller.updateUser
);

export default router;
