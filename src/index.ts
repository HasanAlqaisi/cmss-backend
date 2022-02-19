import { Router } from "express";
import usersRoutes from "./atoms/users/router";
import subjectsRoutes from "./atoms/subjects/router";
import roomsRoutes from "./atoms/rooms/router";
import lecturesRoutes from "./atoms/lectures/router";

const router = Router();

router.use("/api/users", usersRoutes);

router.use("/api/subjects", subjectsRoutes);

router.use("/api/rooms", roomsRoutes);

router.use("/api/lectures", lecturesRoutes);

export default router;
