import { Router } from "express";
import passport from "passport";
import usersRoutes from "./atoms/users/router";
import subjectsRoutes from "./atoms/subjects/router";
import roomsRoutes from "./atoms/rooms/router";
import lecturesRoutes from "./atoms/lectures/router";
import schedulesRoutes from "./atoms/schedules/router";
import specialtiesRoutes from "./atoms/specialties/router";
import branchesRoutes from "./atoms/branches/router";
import materialsRoutes from "./atoms/materials/router";
import channelsRoutes from "./atoms/channels/router";
import applicantsRoutes from "./atoms/applicants/router";
import yearsRoutes from "./atoms/years/router";
import acceptancesRoutes from "./atoms/acceptances/router";

const router = Router();

router.use("/api/users", usersRoutes);

router.use(
  "/api/subjects",
  passport.authenticate("jwt", { session: false }),
  subjectsRoutes
);

router.use(
  "/api/rooms",
  passport.authenticate("jwt", { session: false }),
  roomsRoutes
);

router.use(
  "/api/lectures",
  passport.authenticate("jwt", { session: false }),
  lecturesRoutes
);

router.use(
  "/api/schedules",
  passport.authenticate("jwt", { session: false }),
  schedulesRoutes
);

router.use(
  "/api/specialties",
  passport.authenticate("jwt", { session: false }),
  specialtiesRoutes
);

router.use(
  "/api/branches",
  passport.authenticate("jwt", { session: false }),
  branchesRoutes
);

router.use(
  "/api/materials",
  passport.authenticate("jwt", { session: false }),
  materialsRoutes
);

router.use(
  "/api/channels",
  passport.authenticate("jwt", { session: false }),
  channelsRoutes
);

router.use(
  "/api/applicants",
  passport.authenticate("jwt", { session: false }),
  applicantsRoutes
);

router.use(
  "/api/years",
  passport.authenticate("jwt", { session: false }),
  yearsRoutes
);

router.use(
  "/api/acceptances",
  passport.authenticate("jwt", { session: false }),
  acceptancesRoutes
);

export default router;
