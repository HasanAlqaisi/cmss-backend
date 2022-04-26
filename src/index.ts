import { Router } from "express";
import passport from "passport";
import usersRoutes from "./atoms/users/router";
import rolesRoutes from "./atoms/roles/router";
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
import itemsRoutes from "./atoms/items/router";
import categoriesRoutes from "./atoms/categories/router";
import listsRoutes from "./atoms/lists/router";
import attendancesRoutes from "./atoms/attendances/router";
import studentsRoutes from "./atoms/students/router";
import warningRoutes from "./atoms/reports/router";
import absencesRoutes from "./atoms/absences/router";
import classesRoutes from "./atoms/classes/router";
import permissions from "./middlewares/permissions";

const router = Router();

router.use("/users", usersRoutes);

router.use(passport.authenticate("jwt", { session: false }));

router.use("/roles", permissions("manage", "Role"), rolesRoutes);

router.use("/subjects", permissions("manage", "Subject"), subjectsRoutes);

router.use("/rooms", permissions("manage", "Room"), roomsRoutes);

router.use("/lectures", permissions("manage", "Lecture"), lecturesRoutes);

router.use("/schedules", permissions("manage", "Schedule"), schedulesRoutes);

router.use(
  "/specialties",
  permissions("manage", "Specialty"),
  specialtiesRoutes
);

router.use("/branches", permissions("manage", "Branch"), branchesRoutes);

router.use("/materials", permissions("manage", "Material"), materialsRoutes);

router.use("/channels", permissions("manage", "Channel"), channelsRoutes);

router.use("/applicants", permissions("manage", "Applicant"), applicantsRoutes);

router.use("/years", permissions("manage", "Year"), yearsRoutes);

router.use(
  "/acceptances",
  permissions("manage", "Applicant"),
  acceptancesRoutes
);

router.use("/categories", permissions("manage", "Category"), categoriesRoutes);

router.use("/items", permissions("manage", "Item"), itemsRoutes);

router.use("/lists", permissions("manage", "List"), listsRoutes);

router.use(
  "/attendances",
  permissions("manage", "Attendance"),
  attendancesRoutes
);

router.use("/students", permissions("manage", "Student"), studentsRoutes);

router.use("/warnings", permissions("manage", "Attendance"), warningRoutes);

router.use("/absences", permissions("manage", "Absence"), absencesRoutes);

router.use("/classes", permissions("manage", "Class"), classesRoutes);

export default router;
