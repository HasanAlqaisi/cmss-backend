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

router.use(passport.authenticate("jwt", { session: false }));

router.use("/api/subjects", permissions("manage", "Subject"), subjectsRoutes);

router.use("/api/rooms", permissions("manage", "Room"), roomsRoutes);

router.use("/api/lectures", permissions("manage", "Lecture"), lecturesRoutes);

router.use(
  "/api/schedules",
  permissions("manage", "Schedule"),
  schedulesRoutes
);

router.use(
  "/api/specialties",
  permissions("manage", "Specialty"),
  specialtiesRoutes
);

router.use("/api/branches", permissions("manage", "Branch"), branchesRoutes);

router.use(
  "/api/materials",
  permissions("manage", "Material"),
  materialsRoutes
);

router.use("/api/channels", permissions("manage", "Channel"), channelsRoutes);

router.use(
  "/api/applicants",
  permissions("manage", "Applicant"),
  applicantsRoutes
);

router.use("/api/years", permissions("manage", "Year"), yearsRoutes);

router.use(
  "/api/acceptances",
  permissions("manage", "Applicant"),
  acceptancesRoutes
);

export default router;
