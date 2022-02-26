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
import permissions from "./middlewares/permissions";

const router = Router();

router.use("/api/users", usersRoutes);

router.use(
  "/api/subjects",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Subject"),
  subjectsRoutes
);

router.use(
  "/api/rooms",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Room"),
  roomsRoutes
);

router.use(
  "/api/lectures",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Lecture"),
  lecturesRoutes
);

router.use(
  "/api/schedules",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Schedule"),
  schedulesRoutes
);

router.use(
  "/api/specialties",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Specialty"),
  specialtiesRoutes
);

router.use(
  "/api/branches",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Branch"),
  branchesRoutes
);

router.use(
  "/api/materials",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Material"),
  materialsRoutes
);

router.use(
  "/api/channels",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Channel"),
  channelsRoutes
);

router.use(
  "/api/applicants",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Applicant"),
  applicantsRoutes
);

router.use(
  "/api/years",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Year"),
  yearsRoutes
);

router.use(
  "/api/acceptances",
  passport.authenticate("jwt", { session: false }),
  permissions("manage", "Applicant"),
  acceptancesRoutes
);

export default router;
