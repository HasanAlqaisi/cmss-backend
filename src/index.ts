import { Router } from "express";
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

router.use("/api/subjects", subjectsRoutes);

router.use("/api/rooms", roomsRoutes);

router.use("/api/lectures", lecturesRoutes);

router.use("/api/schedules", schedulesRoutes);

router.use("/api/specialties", specialtiesRoutes);

router.use("/api/branches", branchesRoutes);

router.use("/api/materials", materialsRoutes);

router.use("/api/channels", channelsRoutes);

router.use("/api/applicants", applicantsRoutes);

router.use("/api/years", yearsRoutes);

router.use("/api/acceptances", acceptancesRoutes);

export default router;
